# Drag & Drop Image Upload Component Documentation

## Overview
The `DragDropImageUpload` component provides a comprehensive, reusable solution for image uploads across all admin pages in the Sanatoni Mart application. It supports both drag-and-drop and click-to-upload functionality with modern UX patterns.

## Features

### 🎯 Core Functionality
- **Drag & Drop**: Native drag-and-drop support with visual feedback
- **Click to Upload**: Traditional file picker as fallback
- **Multiple Files**: Support for single or multiple image uploads
- **Progress Tracking**: Real-time upload progress indicators
- **Image Preview**: Instant preview of uploaded images
- **Error Handling**: Comprehensive error messages and validation

### 🎨 Advanced Features
- **Primary Image Selection**: Designate one image as primary for products
- **Image Reordering**: Drag to reorder images (when enabled)
- **Image Management**: View, edit, and delete uploaded images
- **File Validation**: Size, type, and quantity limits
- **Responsive Design**: Works on desktop and mobile devices

## Component Props

### Required Props
```typescript
interface DragDropImageUploadProps {
  images: ImageFile[];              // Current images array
  onImagesChange?: (images: ImageFile[]) => void; // Callback when images change
}
```

### Optional Props
```typescript
interface DragDropImageUploadProps {
  // Upload Configuration
  maxImages?: number;               // Maximum number of images (default: 10)
  multiple?: boolean;               // Allow multiple images (default: true)
  maxSize?: number;                 // Max file size in bytes (default: 5MB)
  accept?: string[];                // Accepted file types
  
  // Upload Handling
  uploadEndpoint?: string;          // API endpoint for immediate upload
  uploadData?: Record<string, any>; // Additional form data for upload
  onUpload?: (files: File[]) => Promise<ImageFile[]>; // Custom upload handler
  onDelete?: (image: ImageFile) => Promise<void>;     // Custom delete handler
  onError?: (error: string) => void; // Error callback
  
  // Features
  allowReorder?: boolean;           // Enable drag-to-reorder (default: false)
  allowPrimary?: boolean;           // Enable primary image selection (default: false)
  showPreview?: boolean;            // Show image previews (default: true)
  
  // UI Customization
  label?: string;                   // Component label
  helpText?: string;                // Help text below upload area
  required?: boolean;               // Mark as required field
  disabled?: boolean;               // Disable upload
  className?: string;               // Additional CSS classes
}
```

## Usage Examples

### 1. Basic Single Image Upload (Sliders)
```typescript
import DragDropImageUpload from '@/Components/DragDropImageUpload';

const [images, setImages] = useState<ImageFile[]>([]);

const handleImageUpload = async (files: File[]): Promise<ImageFile[]> => {
  return files.map((file, index) => ({
    id: Date.now() + index,
    file,
    url: URL.createObjectURL(file),
    name: file.name,
    preview: URL.createObjectURL(file)
  }));
};

return (
  <DragDropImageUpload
    images={images}
    onImagesChange={setImages}
    onUpload={handleImageUpload}
    maxImages={1}
    multiple={false}
    label="Background Image"
    required={true}
    helpText="Upload a high-quality image for the slider background (recommended: 1920x1080px)"
  />
);
```

### 2. Multi-Image Upload with Management (Products)
```typescript
const [productImages, setProductImages] = useState<ImageFile[]>([]);

const handleImageUpload = async (files: File[]): Promise<ImageFile[]> => {
  // Custom upload logic or API call
  return files.map((file, index) => ({
    id: Date.now() + index,
    file,
    url: URL.createObjectURL(file),
    name: file.name,
    preview: URL.createObjectURL(file)
  }));
};

const handleImageDelete = async (image: ImageFile) => {
  // API call to delete image
  console.log('Deleting image:', image);
};

return (
  <DragDropImageUpload
    images={productImages}
    onImagesChange={setProductImages}
    onUpload={handleImageUpload}
    onDelete={handleImageDelete}
    maxImages={10}
    multiple={true}
    allowReorder={true}
    allowPrimary={true}
    helpText="Upload product images (PNG, JPG, WebP up to 5MB each)"
  />
);
```

### 3. With Upload Endpoint
```typescript
return (
  <DragDropImageUpload
    images={images}
    onImagesChange={setImages}
    uploadEndpoint="/api/upload"
    uploadData={{ product_id: productId }}
    maxImages={5}
    helpText="Images will be uploaded immediately"
  />
);
```

## Image File Interface
```typescript
interface ImageFile {
  id?: number;          // Unique identifier
  file?: File;          // Original File object (for new uploads)
  url: string;          // Display URL for the image
  name: string;         // File name
  size?: number;        // File size in bytes
  is_primary?: boolean; // Whether this is the primary image
  alt_text?: string;    // Alt text for accessibility
  preview?: string;     // Preview URL (usually same as url)
}
```

## Visual States

### Upload Area States
1. **Default**: Gray dashed border with upload icon and text
2. **Drag Over**: Blue border with highlighted background
3. **Drag Reject**: Red border when invalid files are dragged
4. **Disabled**: Gray background when disabled or limit reached

### Image States
1. **Uploading**: Progress bar with percentage
2. **Uploaded**: Preview with management controls
3. **Error**: Error icon with error message
4. **Primary**: Blue badge indicating primary image

## Integration Guide

### Step 1: Import Component
```typescript
import DragDropImageUpload from '@/Components/DragDropImageUpload';
```

### Step 2: Set Up State
```typescript
const [images, setImages] = useState<ImageFile[]>([]);
```

### Step 3: Create Upload Handler
```typescript
const handleImageUpload = async (files: File[]): Promise<ImageFile[]> => {
  // Your upload logic here
  return uploadedImages;
};
```

### Step 4: Add Component to Form
```typescript
<DragDropImageUpload
  images={images}
  onImagesChange={setImages}
  onUpload={handleImageUpload}
  // ... other props
/>
```

## Customization

### Styling
The component uses Tailwind CSS classes. You can customize:
- Colors by modifying border and background classes
- Spacing by adjusting padding and margin classes
- Layout by changing grid configurations

### File Validation
```typescript
// Custom file types
accept={['image/jpeg', 'image/png', 'image/webp']}

// Custom size limit (10MB)
maxSize={10 * 1024 * 1024}

// Custom quantity limit
maxImages={5}
```

### Error Handling
```typescript
const handleError = (error: string) => {
  console.error('Upload error:', error);
  // Show notification or handle error
};

<DragDropImageUpload
  onError={handleError}
  // ... other props
/>
```

## Accessibility Features
- ✅ Keyboard navigation support
- ✅ Screen reader compatible
- ✅ Proper ARIA labels
- ✅ Focus management
- ✅ Alt text support for images

## Browser Support
- ✅ Chrome 60+
- ✅ Firefox 60+
- ✅ Safari 12+
- ✅ Edge 79+

## Dependencies
- `react-dropzone`: For drag-and-drop functionality
- `@heroicons/react`: For icons
- File reader API for image previews

## Performance Considerations
- Images are previewed using `URL.createObjectURL()` for efficiency
- Large file validation happens before upload
- Progress tracking prevents UI blocking
- Memory cleanup for object URLs

## Security Notes
- File type validation on both client and server
- File size limits enforced
- Malicious file detection (server-side recommended)
- CSRF token included in uploads

## Testing
The component has been tested with:
- Single image uploads (Sliders)
- Multiple image uploads (Products)
- Drag-and-drop functionality
- Error scenarios
- Mobile responsiveness

## Future Enhancements
- [ ] Image cropping/editing
- [ ] Bulk operations
- [ ] Cloud storage integration
- [ ] Advanced image optimization
- [ ] Metadata extraction
