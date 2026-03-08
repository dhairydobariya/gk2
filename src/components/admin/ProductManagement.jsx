import { useState, useEffect } from 'react';
import { getCategories, getProducts, saveProducts } from '../../utils/dataManager';
import { uploadImage, validateImageFile, deleteImage } from '../../utils/imageUpload';
import Toast from '../Toast';
import AdminSearchBar from './AdminSearchBar';
import AdminPagination from './AdminPagination';
import useAdminTable from '../../hooks/useAdminTable';

function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState(null);
  const [pendingFiles, setPendingFiles] = useState({});
  const [oldImages, setOldImages] = useState({});
  const [imagesToDelete, setImagesToDelete] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    rating: '',
    poles: '',
    breakingCapacity: '10KA',
    series: 'C Series',
    price: '',
    image: '/placeholder.png',
    image2: '/placeholder.png',
    image3: '/placeholder.png',
    inStock: true
  });

  // Load data on mount
  useEffect(() => {
    loadData();
    
    // Listen for data updates
    const handleDataUpdate = (event) => {
      if (event.detail.key === 'categories' || event.detail.key === 'products') {
        loadData();
      }
    };
    
    window.addEventListener('dataUpdated', handleDataUpdate);
    return () => window.removeEventListener('dataUpdated', handleDataUpdate);
  }, []);

  const loadData = async () => {
    const [productsData, categoriesData] = await Promise.all([
      getProducts(),
      getCategories()
    ]);
    setProducts(productsData || []);
    setCategories(categoriesData || []);
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
    filterValue,
    handleFilterChange,
    currentPage,
    totalPages,
    itemsPerPage,
    handlePageChange,
    handleItemsPerPageChange
  } = useAdminTable(products, {
    searchFields: ['name', 'rating', 'price'],
    defaultSortField: 'id',
    defaultSortOrder: 'desc',
    defaultItemsPerPage: 10,
    filterField: 'category'
  });

  // Update selectedCategory when filter changes
  useEffect(() => {
    setSelectedCategory(filterValue);
  }, [filterValue]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setUploading(true);
      
      // Upload pending files
      const uploadedData = { ...formData };
      for (const [field, file] of Object.entries(pendingFiles)) {
        if (file) {
          const imageUrl = await uploadImage(file);
          uploadedData[field] = imageUrl;
        }
      }
      
      // Delete marked images after successful upload
      for (const imageUrl of imagesToDelete) {
        await deleteImage(imageUrl);
      }
      
      let updatedProducts;
      
      if (editingId) {
        updatedProducts = products.map(p => 
          p.id === editingId ? { ...uploadedData, id: editingId } : p
        );
      } else {
        const newProduct = {
          ...uploadedData,
          id: `${uploadedData.category}-${Date.now()}`,
          features: [],
          specifications: {}
        };
        updatedProducts = [...products, newProduct];
      }
      
      setProducts(updatedProducts);
      await saveProducts(updatedProducts);
      setToast({ message: 'Product saved successfully!', type: 'success' });
      resetForm();
    } catch (error) {
      setToast({ message: `Failed to save: ${error.message}`, type: 'error' });
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      rating: '',
      poles: '',
      breakingCapacity: '10KA',
      series: 'C Series',
      price: '',
      image: '/placeholder.png',
      image2: '/placeholder.png',
      image3: '/placeholder.png',
      inStock: true
    });
    setPendingFiles({});
    setOldImages({});
    setImagesToDelete([]);
    setIsAdding(false);
    setEditingId(null);
  };

  const handleEdit = (product) => {
    setFormData(product);
    setOldImages({
      image: product.image,
      image2: product.image2,
      image3: product.image3
    });
    setPendingFiles({});
    setImagesToDelete([]);
    setEditingId(product.id);
    setIsAdding(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      const product = products.find(p => p.id === id);
      
      // Delete associated images
      if (product) {
        const imageFields = ['image', 'image2', 'image3'];
        for (const field of imageFields) {
          if (product[field] && product[field].startsWith('/uploads/')) {
            await deleteImage(product[field]);
          }
        }
      }
      
      const updatedProducts = products.filter(p => p.id !== id);
      setProducts(updatedProducts);
      await saveProducts(updatedProducts);
      setToast({ message: 'Product deleted successfully!', type: 'success' });
    }
  };

  // Handle image file selection (store file temporarily)
  const handleImageUpload = (e, imageField) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      validateImageFile(file);
      
      // Store file for later upload
      setPendingFiles({ ...pendingFiles, [imageField]: file });
      
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setFormData({ ...formData, [imageField]: previewUrl });
      
      setToast({ message: 'Image selected. Click Add/Update to save.', type: 'success' });
    } catch (error) {
      setToast({ message: `Invalid file: ${error.message}`, type: 'error' });
    }
  };

  // Handle image removal
  const handleImageRemove = (imageField) => {
    // Mark old uploaded image for deletion (will be deleted on submit)
    if (editingId && oldImages[imageField] && oldImages[imageField].startsWith('/uploads/')) {
      setImagesToDelete([...imagesToDelete, oldImages[imageField]]);
    }
    
    // Clear pending file
    const newPendingFiles = { ...pendingFiles };
    delete newPendingFiles[imageField];
    setPendingFiles(newPendingFiles);
    
    // Reset to placeholder
    setFormData({ ...formData, [imageField]: '/placeholder.png' });
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
        <h1 className="text-2xl font-bold text-gray-900">Product Management</h1>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            + Add Product
          </button>
        )}
      </div>

      {isAdding && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">
            {editingId ? 'Edit Product' : 'Add New Product'}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Category</option>
                <option value="uncategorized">Uncategorized</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
              <input
                type="text"
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="e.g., 6A"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Poles</label>
              <input
                type="text"
                value={formData.poles}
                onChange={(e) => setFormData({ ...formData, poles: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="e.g., 1P, 2P"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
              <input
                type="text"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="e.g., ₹245"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Breaking Capacity</label>
              <input
                type="text"
                value={formData.breakingCapacity}
                onChange={(e) => setFormData({ ...formData, breakingCapacity: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="e.g., 10KA"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Product Images
              </label>
              <div className="grid grid-cols-3 gap-4">
                {/* Image 1 */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-400 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-gray-700">Main Image</span>
                    <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">Required</span>
                  </div>
                  
                  {formData.image && formData.image !== '/placeholder.png' ? (
                    <div className="mb-3">
                      <img src={formData.image} alt="Preview" className="w-full h-32 object-contain bg-gray-50 rounded" onError={(e) => e.target.src = '/placeholder.png'} />
                      <button
                        type="button"
                        onClick={() => handleImageRemove('image')}
                        className="mt-2 w-full text-xs text-red-600 hover:text-red-800"
                      >
                        Remove Image
                      </button>
                    </div>
                  ) : (
                    <div className="mb-3 h-32 bg-gray-50 rounded flex items-center justify-center text-gray-400">
                      <span className="text-4xl">📷</span>
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <label className="block">
                      <span className="sr-only">Choose file</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, 'image')}
                        className="block w-full text-xs text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 file:cursor-pointer"
                        disabled={uploading}
                      />
                    </label>
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                      </div>
                      <div className="relative flex justify-center text-xs">
                        <span className="px-2 bg-white text-gray-500">or</span>
                      </div>
                    </div>
                    <input
                      type="text"
                      value={formData.image === '/placeholder.png' ? '' : formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value || '/placeholder.png' })}
                      className="w-full px-3 py-2 text-xs border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter image URL"
                    />
                  </div>
                </div>

                {/* Image 2 */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-400 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-gray-700">Image 2</span>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">Optional</span>
                  </div>
                  
                  {formData.image2 && formData.image2 !== '/placeholder.png' ? (
                    <div className="mb-3">
                      <img src={formData.image2} alt="Preview" className="w-full h-32 object-contain bg-gray-50 rounded" onError={(e) => e.target.src = '/placeholder.png'} />
                      <button
                        type="button"
                        onClick={() => handleImageRemove('image2')}
                        className="mt-2 w-full text-xs text-red-600 hover:text-red-800"
                      >
                        Remove Image
                      </button>
                    </div>
                  ) : (
                    <div className="mb-3 h-32 bg-gray-50 rounded flex items-center justify-center text-gray-400">
                      <span className="text-4xl">📷</span>
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <label className="block">
                      <span className="sr-only">Choose file</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, 'image2')}
                        className="block w-full text-xs text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 file:cursor-pointer"
                        disabled={uploading}
                      />
                    </label>
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                      </div>
                      <div className="relative flex justify-center text-xs">
                        <span className="px-2 bg-white text-gray-500">or</span>
                      </div>
                    </div>
                    <input
                      type="text"
                      value={formData.image2 === '/placeholder.png' ? '' : formData.image2}
                      onChange={(e) => setFormData({ ...formData, image2: e.target.value || '/placeholder.png' })}
                      className="w-full px-3 py-2 text-xs border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter image URL"
                    />
                  </div>
                </div>

                {/* Image 3 */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-400 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-gray-700">Image 3</span>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">Optional</span>
                  </div>
                  
                  {formData.image3 && formData.image3 !== '/placeholder.png' ? (
                    <div className="mb-3">
                      <img src={formData.image3} alt="Preview" className="w-full h-32 object-contain bg-gray-50 rounded" onError={(e) => e.target.src = '/placeholder.png'} />
                      <button
                        type="button"
                        onClick={() => handleImageRemove('image3')}
                        className="mt-2 w-full text-xs text-red-600 hover:text-red-800"
                      >
                        Remove Image
                      </button>
                    </div>
                  ) : (
                    <div className="mb-3 h-32 bg-gray-50 rounded flex items-center justify-center text-gray-400">
                      <span className="text-4xl">📷</span>
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <label className="block">
                      <span className="sr-only">Choose file</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, 'image3')}
                        className="block w-full text-xs text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 file:cursor-pointer"
                        disabled={uploading}
                      />
                    </label>
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                      </div>
                      <div className="relative flex justify-center text-xs">
                        <span className="px-2 bg-white text-gray-500">or</span>
                      </div>
                    </div>
                    <input
                      type="text"
                      value={formData.image3 === '/placeholder.png' ? '' : formData.image3}
                      onChange={(e) => setFormData({ ...formData, image3: e.target.value || '/placeholder.png' })}
                      className="w-full px-3 py-2 text-xs border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter image URL"
                    />
                  </div>
                </div>
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

            <div className="col-span-2 flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.inStock}
                onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                className="w-4 h-4"
              />
              <label className="text-sm font-medium text-gray-700">In Stock</label>
            </div>

            <div className="col-span-2 flex gap-3">
              <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                {editingId ? 'Update' : 'Add'} Product
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
        placeholder="Search products..."
        filterValue={filterValue}
        onFilterChange={handleFilterChange}
        filterOptions={[
          { value: 'uncategorized', label: 'Uncategorized' },
          ...categories.map(cat => ({ value: cat.id, label: cat.name }))
        ]}
        filterLabel="All Categories"
        showFilter={true}
      />

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100" onClick={() => handleSort('name')}>
                <div className="flex items-center gap-1">
                  Product
                  {sortField === 'name' && (
                    <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>
                  )}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100" onClick={() => handleSort('rating')}>
                <div className="flex items-center gap-1">
                  Rating
                  {sortField === 'rating' && (
                    <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>
                  )}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100" onClick={() => handleSort('price')}>
                <div className="flex items-center gap-1">
                  Price
                  {sortField === 'price' && (
                    <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>
                  )}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100" onClick={() => handleSort('inStock')}>
                <div className="flex items-center gap-1">
                  Stock
                  {sortField === 'inStock' && (
                    <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>
                  )}
                </div>
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {currentData.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium">{product.name}</td>
                <td className="px-6 py-4">{product.rating}</td>
                <td className="px-6 py-4">{product.price}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs ${product.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {product.inStock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => handleEdit(product)} className="text-blue-600 hover:text-blue-800 mr-4">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:text-red-800">
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

export default ProductManagement;
