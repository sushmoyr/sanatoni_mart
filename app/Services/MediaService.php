<?php

namespace App\Services;

use App\Models\MediaFile;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Intervention\Image\ImageManager;
use Exception;

class MediaService
{
    protected array $allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    protected array $allowedVideoTypes = ['video/mp4', 'video/avi', 'video/mov', 'video/webm'];
    protected array $allowedDocumentTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ];

    protected int $maxFileSize = 10485760; // 10MB in bytes
    protected int $maxImageWidth = 2048;
    protected int $maxImageHeight = 2048;

    /**
     * Upload and store a file
     */
    public function uploadFile(UploadedFile $file, ?int $userId = null, string $disk = 'public'): MediaFile
    {
        $this->validateFile($file);

        $filename = $this->generateUniqueFilename($file);
        $path = $this->getStoragePath($file->getMimeType()) . '/' . $filename;

        // Store the original file
        $storedPath = $file->storeAs(
            dirname($path),
            $filename,
            $disk
        );

        // Process image if it's an image file
        $metadata = [];
        if ($this->isImage($file->getMimeType())) {
            $metadata = $this->processImage($file, $storedPath, $disk);
        }

        // Create media file record
        return MediaFile::create([
            'filename' => $filename,
            'original_name' => $file->getClientOriginalName(),
            'mime_type' => $file->getMimeType(),
            'size' => $file->getSize(),
            'path' => $storedPath,
            'disk' => $disk,
            'metadata' => $metadata,
            'uploaded_by' => $userId,
        ]);
    }

    /**
     * Upload multiple files
     */
    public function uploadMultipleFiles(array $files, ?int $userId = null, string $disk = 'public'): array
    {
        $uploadedFiles = [];

        foreach ($files as $file) {
            if ($file instanceof UploadedFile) {
                try {
                    $uploadedFiles[] = $this->uploadFile($file, $userId, $disk);
                } catch (Exception $e) {
                    // Log error but continue with other files
                    logger()->error('File upload failed: ' . $e->getMessage(), [
                        'file' => $file->getClientOriginalName(),
                        'user_id' => $userId,
                    ]);
                }
            }
        }

        return $uploadedFiles;
    }

    /**
     * Delete a media file
     */
    public function deleteFile(MediaFile $mediaFile): bool
    {
        try {
            // Delete the physical file
            Storage::disk($mediaFile->disk)->delete($mediaFile->path);

            // Delete thumbnails if they exist
            if (isset($mediaFile->metadata['thumbnails'])) {
                foreach ($mediaFile->metadata['thumbnails'] as $thumbnail) {
                    Storage::disk($mediaFile->disk)->delete($thumbnail['path']);
                }
            }

            // Delete the database record
            $mediaFile->delete();

            return true;
        } catch (Exception $e) {
            logger()->error('File deletion failed: ' . $e->getMessage(), [
                'media_file_id' => $mediaFile->id,
                'path' => $mediaFile->path,
            ]);

            return false;
        }
    }

    /**
     * Generate thumbnails for an image
     */
    public function generateThumbnails(MediaFile $mediaFile, array $sizes = []): array
    {
        if (!$mediaFile->isImage()) {
            throw new Exception('File is not an image');
        }

        if (empty($sizes)) {
            $sizes = [
                'thumb' => ['width' => 150, 'height' => 150],
                'medium' => ['width' => 300, 'height' => 300],
                'large' => ['width' => 800, 'height' => 600],
            ];
        }

        $thumbnails = [];
        $originalPath = Storage::disk($mediaFile->disk)->path($mediaFile->path);

        foreach ($sizes as $name => $dimensions) {
            try {
                $thumbnailPath = $this->createThumbnail(
                    $originalPath,
                    $dimensions['width'],
                    $dimensions['height'],
                    $name,
                    $mediaFile
                );

                $thumbnails[$name] = [
                    'path' => $thumbnailPath,
                    'width' => $dimensions['width'],
                    'height' => $dimensions['height'],
                    'url' => Storage::disk($mediaFile->disk)->url($thumbnailPath),
                ];
            } catch (Exception $e) {
                logger()->error('Thumbnail generation failed: ' . $e->getMessage(), [
                    'media_file_id' => $mediaFile->id,
                    'size' => $name,
                ]);
            }
        }

        // Update metadata with thumbnails
        $metadata = $mediaFile->metadata ?? [];
        $metadata['thumbnails'] = $thumbnails;
        $mediaFile->update(['metadata' => $metadata]);

        return $thumbnails;
    }

    /**
     * Validate uploaded file
     */
    protected function validateFile(UploadedFile $file): void
    {
        // Check file size
        if ($file->getSize() > $this->maxFileSize) {
            throw new Exception('File size exceeds maximum allowed size of ' . ($this->maxFileSize / 1024 / 1024) . 'MB');
        }

        // Check MIME type
        $mimeType = $file->getMimeType();
        $allowedTypes = array_merge(
            $this->allowedImageTypes,
            $this->allowedVideoTypes,
            $this->allowedDocumentTypes
        );

        if (!in_array($mimeType, $allowedTypes)) {
            throw new Exception('File type not allowed: ' . $mimeType);
        }

        // Additional validation for images
        if ($this->isImage($mimeType)) {
            $imageInfo = getimagesize($file->getRealPath());
            if ($imageInfo === false) {
                throw new Exception('Invalid image file');
            }

            [$width, $height] = $imageInfo;
            if ($width > $this->maxImageWidth || $height > $this->maxImageHeight) {
                throw new Exception("Image dimensions exceed maximum allowed size of {$this->maxImageWidth}x{$this->maxImageHeight}");
            }
        }
    }

    /**
     * Generate unique filename
     */
    protected function generateUniqueFilename(UploadedFile $file): string
    {
        $extension = $file->getClientOriginalExtension();
        $name = Str::slug(pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME));
        $timestamp = now()->format('Y-m-d-H-i-s');
        $random = Str::random(8);

        return "{$name}-{$timestamp}-{$random}.{$extension}";
    }

    /**
     * Get storage path based on file type
     */
    protected function getStoragePath(string $mimeType): string
    {
        if ($this->isImage($mimeType)) {
            return 'media/images/' . date('Y/m');
        }

        if ($this->isVideo($mimeType)) {
            return 'media/videos/' . date('Y/m');
        }

        if ($this->isDocument($mimeType)) {
            return 'media/documents/' . date('Y/m');
        }

        return 'media/other/' . date('Y/m');
    }

    /**
     * Process image file
     */
    protected function processImage(UploadedFile $file, string $storedPath, string $disk): array
    {
        $metadata = [];

        try {
            $imageInfo = getimagesize($file->getRealPath());
            if ($imageInfo !== false) {
                $metadata['dimensions'] = [
                    'width' => $imageInfo[0],
                    'height' => $imageInfo[1],
                ];

                // Add EXIF data if available
                if (function_exists('exif_read_data') && in_array($file->getMimeType(), ['image/jpeg', 'image/tiff'])) {
                    $exif = @exif_read_data($file->getRealPath());
                    if ($exif !== false) {
                        $metadata['exif'] = array_filter([
                            'camera' => $exif['Model'] ?? null,
                            'date_taken' => $exif['DateTimeOriginal'] ?? null,
                            'orientation' => $exif['Orientation'] ?? null,
                        ]);
                    }
                }
            }
        } catch (Exception $e) {
            logger()->error('Image processing failed: ' . $e->getMessage());
        }

        return $metadata;
    }

    /**
     * Create thumbnail
     */
    protected function createThumbnail(string $originalPath, int $width, int $height, string $sizeName, MediaFile $mediaFile): string
    {
        $pathInfo = pathinfo($mediaFile->path);
        $thumbnailFilename = $pathInfo['filename'] . '-' . $sizeName . '.' . $pathInfo['extension'];
        $thumbnailPath = $pathInfo['dirname'] . '/thumbs/' . $thumbnailFilename;

        // Create thumbnail directory if it doesn't exist
        $thumbnailDir = Storage::disk($mediaFile->disk)->path(dirname($thumbnailPath));
        if (!is_dir($thumbnailDir)) {
            mkdir($thumbnailDir, 0755, true);
        }

        // For now, we'll implement a basic thumbnail creation
        // In a real application, you might want to use Intervention Image or similar
        $thumbnailFullPath = Storage::disk($mediaFile->disk)->path($thumbnailPath);
        
        if (extension_loaded('gd')) {
            $this->createThumbnailWithGD($originalPath, $thumbnailFullPath, $width, $height);
        } else {
            // Fallback: copy original file (not ideal, but works)
            copy($originalPath, $thumbnailFullPath);
        }

        return $thumbnailPath;
    }

    /**
     * Create thumbnail using GD library
     */
    protected function createThumbnailWithGD(string $source, string $destination, int $width, int $height): void
    {
        $imageInfo = getimagesize($source);
        if ($imageInfo === false) {
            throw new Exception('Cannot read image information');
        }

        [$originalWidth, $originalHeight, $type] = $imageInfo;

        // Calculate new dimensions maintaining aspect ratio
        $ratio = min($width / $originalWidth, $height / $originalHeight);
        $newWidth = intval($originalWidth * $ratio);
        $newHeight = intval($originalHeight * $ratio);

        // Create source image
        switch ($type) {
            case IMAGETYPE_JPEG:
                $sourceImage = imagecreatefromjpeg($source);
                break;
            case IMAGETYPE_PNG:
                $sourceImage = imagecreatefrompng($source);
                break;
            case IMAGETYPE_GIF:
                $sourceImage = imagecreatefromgif($source);
                break;
            default:
                throw new Exception('Unsupported image type for thumbnail generation');
        }

        if ($sourceImage === false) {
            throw new Exception('Cannot create image from source');
        }

        // Create thumbnail
        $thumbnail = imagecreatetruecolor($newWidth, $newHeight);
        
        // Preserve transparency for PNG and GIF
        if ($type == IMAGETYPE_PNG || $type == IMAGETYPE_GIF) {
            imagealphablending($thumbnail, false);
            imagesavealpha($thumbnail, true);
            $transparent = imagecolorallocatealpha($thumbnail, 255, 255, 255, 127);
            imagefilledrectangle($thumbnail, 0, 0, $newWidth, $newHeight, $transparent);
        }

        imagecopyresampled($thumbnail, $sourceImage, 0, 0, 0, 0, $newWidth, $newHeight, $originalWidth, $originalHeight);

        // Save thumbnail
        switch ($type) {
            case IMAGETYPE_JPEG:
                imagejpeg($thumbnail, $destination, 90);
                break;
            case IMAGETYPE_PNG:
                imagepng($thumbnail, $destination);
                break;
            case IMAGETYPE_GIF:
                imagegif($thumbnail, $destination);
                break;
        }

        imagedestroy($sourceImage);
        imagedestroy($thumbnail);
    }

    /**
     * Check if file is an image
     */
    protected function isImage(string $mimeType): bool
    {
        return in_array($mimeType, $this->allowedImageTypes);
    }

    /**
     * Check if file is a video
     */
    protected function isVideo(string $mimeType): bool
    {
        return in_array($mimeType, $this->allowedVideoTypes);
    }

    /**
     * Check if file is a document
     */
    protected function isDocument(string $mimeType): bool
    {
        return in_array($mimeType, $this->allowedDocumentTypes);
    }

    /**
     * Get media files with pagination and filtering
     */
    public function getMediaFiles(array $filters = [], int $perPage = 20)
    {
        $query = MediaFile::with('uploader');

        // Apply filters
        if (!empty($filters['type'])) {
            switch ($filters['type']) {
                case 'image':
                    $query->whereIn('mime_type', $this->allowedImageTypes);
                    break;
                case 'video':
                    $query->whereIn('mime_type', $this->allowedVideoTypes);
                    break;
                case 'document':
                    $query->whereIn('mime_type', $this->allowedDocumentTypes);
                    break;
            }
        }

        if (!empty($filters['search'])) {
            $query->where(function ($q) use ($filters) {
                $q->where('original_name', 'like', '%' . $filters['search'] . '%')
                  ->orWhere('alt_text', 'like', '%' . $filters['search'] . '%');
            });
        }

        if (!empty($filters['uploaded_by'])) {
            $query->where('uploaded_by', $filters['uploaded_by']);
        }

        return $query->orderBy('created_at', 'desc')->paginate($perPage);
    }
}
