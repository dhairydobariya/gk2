import { useState, useEffect } from 'react';
import { getBanners, saveBanners } from '../../utils/dataManager';
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
    image: '',
    buttonText: 'Explore Products',
    buttonLink: '/products',
    isActive: true,
    order: 1,
    showOn: ['home'],
    backgroundColor: 'from-blue-900 via-blue-800 to-blue-950'
  });

  const pageOptions = ['home', 'products', 'about', 'distributors', 'contact'];
  const bgColorOptions = [
    { label: 'Blue Gradient', value: 'from-blue-900 via-blue-800 to-blue-950' },
    { label: 'Dark Blue', value: 'from-gray-900 via-blue-900 to-gray-900' },
    { label: 'Purple Gradient', value: 'from-purple-900 via-purple-800 to-purple-950' },
    { label: 'Green Gradient', value: 'from-green-900 via-green-800 to-green-950' },
    { label: 'Red Gradient', value: 'from-red-900 via-red-800 to-red-950' }
  ];

  // Load data on mount
  useEffect(() => {
    loadData();
    
    // Listen for data updates
    const handleDataUpdate = (event) => {
      if (event.detail.key === 'banners') {
        loadData();
      }
    };
    
    window.addEventListener('dataUpdated', handleDataUpdate);
    return () => window.removeEventListener('dataUpdated', handleDataUpdate);
  }, []);

  const loadData = async () => {
    const bannersData = await getBanners();
    setBanners(bannersData || []);
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
        uploadedData.image = imageUrl;
      }
      
      // Delete marked image after successful upload
      if (imageToDelete) {
        await deleteImage(imageToDelete);
      }
      
      let updatedBanners;
      
      if (editingId) {
        updatedBanners = banners.map(b => 
          b.id === editingId ? { ...uploadedData, id: editingId } : b
        );
        setEditingId(null);
      } else {
        const newBanner = {
          ...uploadedData,
          id: `banner-${Date.now()}`
        };
        updatedBanners = [...banners, newBanner];
      }
      
      setBanners(updatedBanners);
      await saveBanners(updatedBanners);
      setToast({ message: 'Banner saved successfully!', type: 'success' });
      resetForm();
    } catch (error) {
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
      image: '',
      buttonText: 'Explore Products',
      buttonLink: '/products',
      isActive: true,
      order: 1,
      showOn: ['home'],
      backgroundColor: 'from-blue-900 via-blue-800 to-blue-950'
    });
    setPendingFile(null);
    setOldImage('');
    setImageToDelete('');
    setIsAdding(false);
    setEditingId(null);
  };

  const handleEdit = (banner) => {
    setFormData(banner);
    setOldImage(banner.image);
    setPendingFile(null);
    setImageToDelete('');
    setEditingId(banner.id);
    setIsAdding(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this banner?')) {
      const banner = banners.find(b => b.id === id);
      
      // Delete associated image
      if (banner && banner.image && banner.image.startsWith('/uploads/')) {
        await deleteImage(banner.image);
      }
      
      const updatedBanners = banners.filter(b => b.id !== id);
      setBanners(updatedBanners);
      await saveBanners(updatedBanners);
      setToast({ message: 'Banner deleted successfully!', type: 'success' });
    }
  };

  const toggleActive = async (id) => {
    const updatedBanners = banners.map(b => 
      b.id === id ? { ...b, isActive: !b.isActive } : b
    );
    setBanners(updatedBanners);
    await saveBanners(updatedBanners);
  };

  const handleShowOnChange = (page) => {
    const currentShowOn = formData.showOn || [];
    if (currentShowOn.includes(page)) {
      setFormData({
        ...formData,
        showOn: currentShowOn.filter(p => p !== page)
      });
    } else {
      setFormData({
        ...formData,
        showOn: [...currentShowOn, page]
      });
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
      setFormData({ ...formData, image: previewUrl });
      
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
    setFormData({ ...formData, image: '' });
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
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
                {formData.image ? (
                  <div className="mb-3">
                    <img src={formData.image} alt="Banner preview" className="w-full h-40 object-cover bg-gray-50 rounded" onError={(e) => {
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
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
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

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Background Color</label>
                <select
                  value={formData.backgroundColor}
                  onChange={(e) => setFormData({ ...formData, backgroundColor: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                >
                  {bgColorOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
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
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Show On Pages</label>
              <div className="flex flex-wrap gap-3">
                {pageOptions.map(page => (
                  <label key={page} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.showOn.includes(page)}
                      onChange={() => handleShowOnChange(page)}
                      className="w-4 h-4"
                    />
                    <span className="text-sm capitalize">{page}</span>
                  </label>
                ))}
              </div>
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
              <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                {editingId ? 'Update' : 'Add'} Banner
              </button>
              <button type="button" onClick={resetForm} className="bg-gray-200 px-6 py-2 rounded-lg hover:bg-gray-300">
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Show On</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {currentData.map((banner) => (
              <tr key={banner.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium">{banner.order}</td>
                <td className="px-6 py-4">
                  <div className="font-medium">{banner.title}</div>
                  <div className="text-sm text-gray-500">{banner.subtitle}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {banner.showOn.map(page => (
                      <span key={page} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded capitalize">
                        {page}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => toggleActive(banner.id)}
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
                  <button onClick={() => handleDelete(banner.id)} className="text-red-600 hover:text-red-800">
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
