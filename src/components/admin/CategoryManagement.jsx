import { useState, useEffect } from 'react';
import { categoryAPI, productAPI } from '../../utils/api';
import Toast from '../Toast';
import AdminSearchBar from './AdminSearchBar';
import AdminPagination from './AdminPagination';
import useAdminTable from '../../hooks/useAdminTable';

function CategoryManagement() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [toast, setToast] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  // Load data on mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [categoriesResult, productsResult] = await Promise.all([
        categoryAPI.getAll(),
        productAPI.getAll()
      ]);
      
      if (categoriesResult.success) {
        setCategories(categoriesResult.data || []);
      }
      
      if (productsResult.success) {
        setProducts(productsResult.data || []);
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
    currentPage,
    totalPages,
    itemsPerPage,
    handlePageChange,
    handleItemsPerPageChange
  } = useAdminTable(categories, {
    searchFields: ['name', 'description'],
    defaultSortField: 'name',
    defaultSortOrder: 'asc',
    defaultItemsPerPage: 10
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const categoryData = {
        name: formData.name,
        description: formData.description
      };
      
      let result;
      if (editingId) {
        result = await categoryAPI.update(editingId, categoryData);
      } else {
        result = await categoryAPI.create(categoryData);
      }
      
      if (result.success) {
        setToast({ message: editingId ? 'Category updated successfully!' : 'Category created successfully!', type: 'success' });
        await loadData();
        resetForm();
      } else {
        setToast({ message: result.message || 'Failed to save category', type: 'error' });
      }
    } catch (error) {
      console.error('Error saving category:', error);
      setToast({ message: `Failed to save: ${error.message}`, type: 'error' });
    }
  };

  const resetForm = () => {
    setFormData({ name: '', description: '' });
    setIsAdding(false);
    setEditingId(null);
  };

  const handleEdit = (category) => {
    setFormData({
      name: category.name,
      description: category.description
    });
    setEditingId(category._id);
    setIsAdding(true);
  };

  const handleDelete = async (id) => {
    // Check if any products use this category
    const productsInCategory = products.filter(p => p.categoryId === id);
    
    if (productsInCategory.length > 0) {
      setToast({ 
        message: `Cannot delete category with ${productsInCategory.length} product(s). Please reassign or delete products first.`, 
        type: 'error' 
      });
      return;
    }
    
    if (!window.confirm('Are you sure you want to delete this category?')) {
      return;
    }
    
    try {
      const result = await categoryAPI.delete(id);
      
      if (result.success) {
        setToast({ message: 'Category deleted successfully!', type: 'success' });
        await loadData();
      } else {
        setToast({ message: result.message || 'Failed to delete category', type: 'error' });
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      setToast({ message: `Failed to delete: ${error.message}`, type: 'error' });
    }
  };

  const handleCancel = () => {
    resetForm();
  };

  // Count products per category
  const getProductCount = (categoryId) => {
    if (!Array.isArray(products)) return 0;
    return products.filter(p => p.categoryId === categoryId).length;
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
        <h1 className="text-2xl font-bold text-gray-900">Category Management</h1>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            + Add Category
          </button>
        )}
      </div>

      {isAdding && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">
            {editingId ? 'Edit Category' : 'Add New Category'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows="3"
                required
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {editingId ? 'Update' : 'Add'} Category
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors"
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
        placeholder="Search categories..."
      />

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center gap-1">
                  Name
                  {sortField === 'name' && (
                    <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>
                  )}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Products</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {currentData.map((category) => (
              <tr key={category._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">{category.name}</td>
                <td className="px-6 py-4 text-gray-600">{category.description}</td>
                <td className="px-6 py-4 text-center">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    {getProductCount(category._id)}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => handleEdit(category)}
                    className="text-blue-600 hover:text-blue-800 mr-4"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(category._id)}
                    className="text-red-600 hover:text-red-800"
                  >
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

export default CategoryManagement;
