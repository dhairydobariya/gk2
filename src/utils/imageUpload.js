// Image Upload Utility

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

/**
 * Upload a single image file
 * @param {File} file - The image file to upload
 * @returns {Promise<string>} - The URL path of the uploaded image
 */
export async function uploadImage(file) {
  try {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    const data = await response.json();
    return data.url;
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
    const formData = new FormData();
    files.forEach(file => {
      formData.append('images', file);
    });

    const response = await fetch(`${API_BASE_URL}/upload-multiple`, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    const data = await response.json();
    return data.urls;
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
    // Extract filename from URL
    const filename = imageUrl.split('/').pop();
    
    const response = await fetch(`${API_BASE_URL}/upload/${filename}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      throw new Error('Delete failed');
    }

    return true;
  } catch (error) {
    console.error('Error deleting image:', error);
    return false;
  }
}
