import { useState, useEffect } from 'react';
import { productAPI, categoryAPI } from '../../utils/api';
import { uploadImage, validateImageFile, deleteImage } from '../../utils/imageUpload';
import Toast from '../Toast';
import AdminSearchBar from './AdminSearchBar';
import AdminPagination from './AdminPagination';
import useAdminTable from '../../hooks/useAdminTable';
import VariantManager from './VariantManager';

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
    description: '',
    categoryId: '',
    imageUrl: '/placeholder.png',
    image2: '/placeholder.png',
    image3: '/placeholder.png',
    variants: [{ capacity: '', name: '', price: '', mrp: '', specifications: {} }]
  });

  // Load data on mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [productsResult, categoriesResult] = await Promise.all([
        productAPI.getAll(),
        categoryAPI.getAll()
      ]);
      
      if (productsResult.success) {
        setProducts(productsResult.data || []);
      }
      
      if (categoriesResult.success) {
        setCategories(categoriesResult.data || []);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      setToast({ message: 'Failed to load data', type: 'error' });
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
    filterValue,
    handleFilterChange,
    currentPage,
    totalPages,
    itemsPerPage,
    handlePageChange,
    handleItemsPerPageChange
  } = useAdminTable(products, {
    searchFields: ['name', 'description'],
    defaultSortField: '_id',
    defaultSortOrder: 'desc',
    defaultItemsPerPage: 10,
    filterField: 'categoryId'
  });

  // Update selectedCategory when filter changes
  useEffect(() => {
    setSelectedCategory(filterValue);
  }, [filterValue]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.categoryId) {
      setToast({ message: 'Please select a category', type: 'error' });
      return;
    }
    
    if (!formData.variants || formData.variants.length === 0) {
      setToast({ message: 'At least one variant is required', type: 'error' });
      return;
    }
    
    // Validate each variant
    for (let i = 0; i < formData.variants.length; i++) {
      const variant = formData.variants[i];
      if (!variant.capacity || !variant.name || !variant.price) {
        setToast({ message: `Variant ${i + 1}: Capacity, Name, and Price are required`, type: 'error' });
        return;
      }
      if (parseFloat(variant.price) <= 0) {
        setToast({ message: `Variant ${i + 1}: Price must be greater than 0`, type: 'error' });
        return;
      }
      if (variant.mrp && parseFloat(variant.mrp) < parseFloat(variant.price)) {
        setToast({ message: `Variant ${i + 1}: MRP must be greater than or equal to Price`, type: 'error' });
        return;
      }
    }
    
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
      
      // Prepare data for API
      const productData = {
        name: uploadedData.name,
        description: uploadedData.description,
        categoryId: uploadedData.categoryId,
        imageUrl: uploadedData.imageUrl === '/placeholder.png' ? '' : uploadedData.imageUrl,
        image2: uploadedData.image2 === '/placeholder.png' ? '' : uploadedData.image2,
        image3: uploadedData.image3 === '/placeholder.png' ? '' : uploadedData.image3,
        variants: uploadedData.variants.map(v => ({
          capacity: v.capacity,
          name: v.name,
          price: parseFloat(v.price),
          mrp: v.mrp ? parseFloat(v.mrp) : undefined,
          specifications: v.specifications || {}
        }))
      };
      
      let result;
      if (editingId) {
        result = await productAPI.update(editingId, productData);
      } else {
        result = await productAPI.create(productData);
      }
      
      if (result.success) {
        setToast({ message: editingId ? 'Product updated successfully!' : 'Product created successfully!', type: 'success' });
        await loadData();
        resetForm();
      } else {
        setToast({ message: result.message || 'Failed to save product', type: 'error' });
      }
    } catch (error) {
      console.error('Error saving product:', error);
      setToast({ message: `Failed to save: ${error.message}`, type: 'error' });
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      categoryId: '',
      imageUrl: '/placeholder.png',
      image2: '/placeholder.png',
      image3: '/placeholder.png',
      variants: [{ capacity: '', name: '', price: '', mrp: '', specifications: {} }]
    });
    setPendingFiles({});
    setOldImages({});
    setImagesToDelete([]);
    setIsAdding(false);
    setEditingId(null);
  };

  const handleEdit = (product) => {
    setFormData({
      name: product.name,
      description: product.description,
      categoryId: product.categoryId,
      imageUrl: product.imageUrl || '/placeholder.png',
      image2: product.image2 || '/placeholder.png',
      image3: product.image3 || '/placeholder.png',
      variants: product.variants && product.variants.length > 0 
        ? product.variants 
        : [{ capacity: '', name: '', price: '', mrp: '', specifications: {} }]
    });
    setOldImages({
      imageUrl: product.imageUrl,
      image2: product.image2,
      image3: product.image3
    });
    setPendingFiles({});
    setImagesToDelete([]);
    setEditingId(product._id);
    setIsAdding(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const result = await productAPI.delete(id);
        
        if (result.success) {
          setToast({ message: 'Product deleted successfully!', type: 'success' });
          await loadData();
        } else {
          setToast({ message: result.message || 'Failed to delete product', type: 'error' });
        }
      } catch (error) {
        console.error('Error deleting product:', error);
        setToast({ message: `Failed to delete: ${error.message}`, type: 'error' });
      }
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

  // Get category name by ID
  const getCategoryName = (categoryId) => {
    const category = categories.find(c => c._id === categoryId);
    return category ? category.name : 'Unknown';
  };

  // Get price range from variants
  const getPriceRange = (variants) => {
    if (!variants || variants.length === 0) return 'N/A';
    const prices = variants.map(v => v.price).filter(p => p);
    if (prices.length === 0) return 'N/A';
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    return min === max ? `₹${min}` : `₹${min} - ₹${max}`;
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
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                rows="3"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Product Images
              </label>
              <div className="grid grid-cols-3 gap-4">
                {/* Image URL */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-400 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-gray-700">Main Image</span>
                    <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">Required</span>
                  </div>
                  
                  {formData.imageUrl && formData.imageUrl !== '/placeholder.png' ? (
                    <div className="mb-3">
                      <img src={formData.imageUrl} alt="Preview" className="w-full h-32 object-contain bg-gray-50 rounded" onError={(e) => e.target.src = '/placeholder.png'} />
                      <button
                        type="button"
                        onClick={() => handleImageRemove('imageUrl')}
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
                        onChange={(e) => handleImageUpload(e, 'imageUrl')}
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
                      value={formData.imageUrl === '/placeholder.png' ? '' : formData.imageUrl}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value || '/placeholder.png' })}
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

            <VariantManager
              variants={formData.variants}
              onChange={(newVariants) => setFormData({ ...formData, variants: newVariants })}
            />

            <div className="flex gap-3 pt-4">
              <button 
                type="submit" 
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                disabled={uploading}
              >
                {uploading ? 'Saving...' : (editingId ? 'Update' : 'Add')} Product
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
        placeholder="Search products..."
        filterValue={filterValue}
        onFilterChange={handleFilterChange}
        filterOptions={categories.map(cat => ({ value: cat._id, label: cat.name }))}
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Variants
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Price Range
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {currentData.map((product) => (
              <tr key={product._id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="font-medium">{product.name}</div>
                  {product.variants && product.variants.length > 1 && (
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded mt-1 inline-block">
                      {product.variants.length} variants
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">{getCategoryName(product.categoryId)}</td>
                <td className="px-6 py-4">
                  {product.variants && product.variants[0] ? product.variants[0].capacity : 'N/A'}
                </td>
                <td className="px-6 py-4">{getPriceRange(product.variants)}</td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => handleEdit(product)} className="text-blue-600 hover:text-blue-800 mr-4">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(product._id)} className="text-red-600 hover:text-red-800">
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
