// Image Upload Utility

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

/**
 * Upload a single image file
 * @param {File} file - The image file to upload
 * @returns {Promise<string>} - The URL path of the uploaded image
 */
export async function uploadImage(file) {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'products'); // Default folder

    const token = localStorage.getItem('token');
    
    const response = await fetch(`${BACKEND_URL}/api/v1/Upload/AddFile`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    const data = await response.json();
    if (data.status === 1) {
      return data.data; // Returns the file path
    } else {
      throw new Error(data.message || 'Upload failed');
    }
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
}

/**
 * Upload multiple image files
 * @param {File[]} files - Array of image files to upload
 * @returns {Promise<string[]>} - Array of URL paths of uploaded images
 */
export async function uploadMultipleImages(files) {
  try {
    const uploadPromises = files.map(file => uploadImage(file));
    return await Promise.all(uploadPromises);
  } catch (error) {
    console.error('Error uploading images:', error);
    throw error;
  }
}

/**
 * Validate image file
 * @param {File} file - The file to validate
 * @returns {boolean} - True if valid, throws error if invalid
 */
export function validateImageFile(file) {
  // Check if file exists
  if (!file) {
    throw new Error('No file selected');
  }

  // Check file type
  if (!file.type.startsWith('image/')) {
    throw new Error('File must be an image');
  }

  // Check file size (5MB limit)
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    throw new Error('Image size must be less than 5MB');
  }

  return true;
}

/**
 * Delete an uploaded image
 * @param {string} imageUrl - The URL path of the image to delete (e.g., /uploads/123-image.jpg)
 * @returns {Promise<boolean>} - True if deleted successfully
 */
export async function deleteImage(imageUrl) {
  try {
    if (!imageUrl || !imageUrl.startsWith('/uploads/')) {
      return false; // Not an uploaded file, skip deletion
    }

    const token = localStorage.getItem('token');
    
    const response = await fetch(`${BACKEND_URL}/api/v1/Upload/RemoveFile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        file: [{ filePath: imageUrl }]
      })
    });

    if (!response.ok) {
      throw new Error('Delete failed');
    }

    const data = await response.json();
    return data.status === 1;
  } catch (error) {
    console.error('Error deleting image:', error);
    return false;
  }
}
