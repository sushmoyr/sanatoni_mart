<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\MediaFile;
use App\Services\MediaService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;
use Inertia\Response;
use Exception;

class MediaController extends Controller
{
    public function __construct(
        protected MediaService $mediaService
    ) {}

    /**
     * Display a listing of the media files
     */
    public function index(Request $request): Response
    {
        $filters = $request->only(['type', 'search', 'uploaded_by']);
        $perPage = $request->get('per_page', 20);

        $mediaFiles = $this->mediaService->getMediaFiles($filters, $perPage);

        return Inertia::render('Admin/Media/Index', [
            'mediaFiles' => $mediaFiles,
            'filters' => $filters,
        ]);
    }

    /**
     * Store uploaded files
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'files' => 'required|array',
            'files.*' => 'required|file|max:10240', // 10MB max
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            $uploadedFiles = $this->mediaService->uploadMultipleFiles(
                $request->file('files'),
                auth()->id()
            );

            return response()->json([
                'success' => true,
                'message' => count($uploadedFiles) . ' file(s) uploaded successfully',
                'files' => $uploadedFiles,
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Upload failed: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Display the specified media file
     */
    public function show(MediaFile $mediaFile): Response
    {
        $mediaFile->load('uploader');

        return Inertia::render('Admin/Media/Show', [
            'mediaFile' => $mediaFile,
        ]);
    }

    /**
     * Update the specified media file
     */
    public function update(Request $request, MediaFile $mediaFile): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'alt_text' => 'nullable|string|max:255',
            'original_name' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            $mediaFile->update($validator->validated());

            return response()->json([
                'success' => true,
                'message' => 'Media file updated successfully',
                'file' => $mediaFile->fresh(),
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Update failed: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Remove the specified media file
     */
    public function destroy(MediaFile $mediaFile): JsonResponse
    {
        try {
            $success = $this->mediaService->deleteFile($mediaFile);

            if ($success) {
                return response()->json([
                    'success' => true,
                    'message' => 'Media file deleted successfully',
                ]);
            } else {
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to delete media file',
                ], 500);
            }
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Delete failed: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Generate thumbnails for an image
     */
    public function generateThumbnails(Request $request, MediaFile $mediaFile): JsonResponse
    {
        if (!$mediaFile->isImage()) {
            return response()->json([
                'success' => false,
                'message' => 'File is not an image',
            ], 400);
        }

        try {
            $sizes = $request->get('sizes', []);
            $thumbnails = $this->mediaService->generateThumbnails($mediaFile, $sizes);

            return response()->json([
                'success' => true,
                'message' => 'Thumbnails generated successfully',
                'thumbnails' => $thumbnails,
                'file' => $mediaFile->fresh(),
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Thumbnail generation failed: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get media files for selection (used in modals, etc.)
     */
    public function select(Request $request): JsonResponse
    {
        $filters = $request->only(['type', 'search']);
        $perPage = $request->get('per_page', 20);

        $mediaFiles = $this->mediaService->getMediaFiles($filters, $perPage);

        return response()->json([
            'success' => true,
            'files' => $mediaFiles,
        ]);
    }

    /**
     * Bulk operations on media files
     */
    public function bulk(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'action' => 'required|in:delete,generate_thumbnails',
            'ids' => 'required|array',
            'ids.*' => 'required|integer|exists:media_files,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $mediaFiles = MediaFile::whereIn('id', $request->ids)->get();
        $action = $request->action;
        $results = [];

        foreach ($mediaFiles as $mediaFile) {
            try {
                switch ($action) {
                    case 'delete':
                        $success = $this->mediaService->deleteFile($mediaFile);
                        $results[] = [
                            'id' => $mediaFile->id,
                            'success' => $success,
                            'message' => $success ? 'Deleted' : 'Failed to delete',
                        ];
                        break;

                    case 'generate_thumbnails':
                        if ($mediaFile->isImage()) {
                            $this->mediaService->generateThumbnails($mediaFile);
                            $results[] = [
                                'id' => $mediaFile->id,
                                'success' => true,
                                'message' => 'Thumbnails generated',
                            ];
                        } else {
                            $results[] = [
                                'id' => $mediaFile->id,
                                'success' => false,
                                'message' => 'Not an image file',
                            ];
                        }
                        break;
                }
            } catch (Exception $e) {
                $results[] = [
                    'id' => $mediaFile->id,
                    'success' => false,
                    'message' => $e->getMessage(),
                ];
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'Bulk operation completed',
            'results' => $results,
        ]);
    }
}
