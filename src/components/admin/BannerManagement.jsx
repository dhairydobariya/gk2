import { useState, useEffect } from 'react';
import { bannerAPI } from '../../utils/api';
import { uploadImage, validateImageFile, deleteImage } from '../../utils/imageUpload';
import Toast from '../Toast';
import AdminSearchBar from './AdminSearchBar';
import AdminPagination from './AdminPagination';
import useAdminTable from '../../hooks/useAdminTable';

function BannerManagement() {
  const [banners, setBanners] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState(null);
  const [pendingFile, setPendingFile] = useState(null);
  const [oldImage, setOldImage] = useState('');
  const [imageToDelete, setImageToDelete] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    imageUrl: '',
    buttonText: 'Explore Products',
    buttonLink: '/products',
    isActive: true,
    order: 1
  });

  // Load data on mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const result = await bannerAPI.getAll();
      if (result.success) {
        setBanners(result.data || []);
      }
    } catch (error) {
      console.error('Error loading banners:', error);
      setToast({ message: 'Failed to load banners', type: 'error' });
    }
  };

  // Use admin table hook
  const {
    currentData,
    totalItems,
    searchQuery,
    handleSearchChange,
    sortField,
    sortOrder,
    handleSort,
    currentPage,
    totalPages,
    itemsPerPage,
    handlePageChange,
    handleItemsPerPageChange
  } = useAdminTable(banners, {
    searchFields: ['title', 'subtitle', 'description'],
    defaultSortField: 'order',
    defaultSortOrder: 'asc',
    defaultItemsPerPage: 10
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setUploading(true);
      
      // Upload pending file if exists
      let uploadedData = { ...formData };
      if (pendingFile) {
        const imageUrl = await uploadImage(pendingFile);
        uploadedData.imageUrl = imageUrl;
      }
      
      // Delete marked image after successful upload
      if (imageToDelete) {
        await deleteImage(imageToDelete);
      }
      
      const bannerData = {
        title: uploadedData.title,
        subtitle: uploadedData.subtitle,
        description: uploadedData.description,
        imageUrl: uploadedData.imageUrl || '',
        buttonText: uploadedData.buttonText,
        buttonLink: uploadedData.buttonLink,
        isActive: uploadedData.isActive,
        order: parseInt(uploadedData.order)
      };
      
      let result;
      if (editingId) {
        result = await bannerAPI.update(editingId, bannerData);
      } else {
        result = await bannerAPI.create(bannerData);
      }
      
      if (result.success) {
        setToast({ message: editingId ? 'Banner updated successfully!' : 'Banner created successfully!', type: 'success' });
        await loadData();
        resetForm();
      } else {
        setToast({ message: result.message || 'Failed to save banner', type: 'error' });
      }
    } catch (error) {
      console.error('Error saving banner:', error);
      setToast({ message: `Failed to save: ${error.message}`, type: 'error' });
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      subtitle: '',
      description: '',
      imageUrl: '',
      buttonText: 'Explore Products',
      buttonLink: '/products',
      isActive: true,
      order: 1
    });
    setPendingFile(null);
    setOldImage('');
    setImageToDelete('');
    setIsAdding(false);
    setEditingId(null);
  };

  const handleEdit = (banner) => {
    setFormData({
      title: banner.title,
      subtitle: banner.subtitle || '',
      description: banner.description || '',
      imageUrl: banner.imageUrl || '',
      buttonText: banner.buttonText || 'Explore Products',
      buttonLink: banner.buttonLink || '/products',
      isActive: banner.isActive !== undefined ? banner.isActive : true,
      order: banner.order || 1
    });
    setOldImage(banner.imageUrl);
    setPendingFile(null);
    setImageToDelete('');
    setEditingId(banner._id);
    setIsAdding(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this banner?')) {
      try {
        const result = await bannerAPI.delete(id);
        
        if (result.success) {
          setToast({ message: 'Banner deleted successfully!', type: 'success' });
          await loadData();
        } else {
          setToast({ message: result.message || 'Failed to delete banner', type: 'error' });
        }
      } catch (error) {
        console.error('Error deleting banner:', error);
        setToast({ message: `Failed to delete: ${error.message}`, type: 'error' });
      }
    }
  };

  const toggleActive = async (id) => {
    try {
      const banner = banners.find(b => b._id === id);
      if (!banner) return;
      
      const result = await bannerAPI.update(id, {
        ...banner,
        isActive: !banner.isActive
      });
      
      if (result.success) {
        await loadData();
      }
    } catch (error) {
      console.error('Error toggling banner status:', error);
      setToast({ message: 'Failed to update banner status', type: 'error' });
    }
  };

  // Handle image file selection (store file temporarily)
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      validateImageFile(file);
      
      // Store file for later upload
      setPendingFile(file);
      
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setFormData({ ...formData, imageUrl: previewUrl });
      
      setToast({ message: 'Image selected. Click Add/Update to save.', type: 'success' });
    } catch (error) {
      setToast({ message: `Invalid file: ${error.message}`, type: 'error' });
    }
  };

  // Handle image removal
  const handleImageRemove = () => {
    // Mark old uploaded image for deletion (will be deleted on submit)
    if (editingId && oldImage && oldImage.startsWith('/uploads/')) {
      setImageToDelete(oldImage);
    }
    
    // Clear pending file
    setPendingFile(null);
    
    // Reset to empty
    setFormData({ ...formData, imageUrl: '' });
    setToast({ message: 'Image will be removed when you save.', type: 'success' });
  };

  return (
    <div>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Banner Management</h1>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            + Add Banner
          </button>
        )}
      </div>

      {isAdding && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">
            {editingId ? 'Edit Banner' : 'Add New Banner'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
                rows="2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Background Image
                <span className="text-xs text-gray-500 ml-2">(Optional)</span>
              </label>
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-400 transition-colors">
                {formData.imageUrl ? (
                  <div className="mb-3">
                    <img src={formData.imageUrl} alt="Banner preview" className="w-full h-40 object-cover bg-gray-50 rounded" onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }} />
                    <div className="hidden w-full h-40 bg-gray-50 rounded items-center justify-center text-gray-400">
                      <span className="text-5xl">🖼️</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleImageRemove}
                      className="mt-2 w-full text-sm text-red-600 hover:text-red-800"
                    >
                      Remove Image
                    </button>
                  </div>
                ) : (
                  <div className="mb-3 h-40 bg-gray-50 rounded flex items-center justify-center text-gray-400">
                    <div className="text-center">
                      <span className="text-5xl block mb-2">🖼️</span>
                      <span className="text-sm text-gray-500">No image selected</span>
                    </div>
                  </div>
                )}
                
                <div className="space-y-3">
                  <label className="block">
                    <span className="sr-only">Choose file</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="block w-full text-sm text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 file:cursor-pointer"
                      disabled={uploading}
                    />
                  </label>
                  
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">or enter URL</span>
                    </div>
                  </div>
                  
                  <input
                    type="text"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="https://example.com/image.jpg or /images/banner.jpg"
                  />
                </div>
                
                {uploading && (
                  <div className="mt-3 text-sm text-blue-600 flex items-center justify-center gap-2 bg-blue-50 py-2 rounded">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Uploading image...
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Button Text</label>
                <input
                  type="text"
                  value={formData.buttonText}
                  onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Button Link</label>
                <input
                  type="text"
                  value={formData.buttonLink}
                  onChange={(e) => setFormData({ ...formData, buttonLink: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="/products or /products/product-id"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Display Order</label>
              <input
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border rounded-lg"
                min="1"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="w-4 h-4"
              />
              <label className="text-sm font-medium text-gray-700">Active</label>
            </div>

            <div className="flex gap-3">
              <button 
                type="submit" 
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                disabled={uploading}
              >
                {uploading ? 'Saving...' : (editingId ? 'Update' : 'Add')} Banner
              </button>
              <button 
                type="button" 
                onClick={resetForm} 
                className="bg-gray-200 px-6 py-2 rounded-lg hover:bg-gray-300"
                disabled={uploading}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <AdminSearchBar
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        placeholder="Search banners..."
      />

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('order')}
              >
                <div className="flex items-center gap-1">
                  Order
                  {sortField === 'order' && (
                    <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>
                  )}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('title')}
              >
                <div className="flex items-center gap-1">
                  Title
                  {sortField === 'title' && (
                    <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>
                  )}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {currentData.map((banner) => (
              <tr key={banner._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium">{banner.order}</td>
                <td className="px-6 py-4">
                  <div className="font-medium">{banner.title}</div>
                  <div className="text-sm text-gray-500">{banner.subtitle}</div>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => toggleActive(banner._id)}
                    className={`px-3 py-1 rounded text-xs font-medium ${
                      banner.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {banner.isActive ? 'Active' : 'Inactive'}
                  </button>
                </td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => handleEdit(banner)} className="text-blue-600 hover:text-blue-800 mr-4">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(banner._id)} className="text-red-600 hover:text-red-800">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        <AdminPagination
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          totalItems={totalItems}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
        />
      </div>
    </div>
  );
}

export default BannerManagement;
