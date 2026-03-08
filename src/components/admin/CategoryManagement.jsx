import { useState, useEffect } from 'react';
import { getCategories, saveCategories, getProducts, saveProducts } from '../../utils/dataManager';
import AdminSearchBar from './AdminSearchBar';
import AdminPagination from './AdminPagination';
import useAdminTable from '../../hooks/useAdminTable';

function CategoryManagement() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    description: ''
  });

  // Load data on mount
  useEffect(() => {
    loadData();
    
    // Listen for data updates from other components
    const handleDataUpdate = (event) => {
      if (event.detail.key === 'categories' || event.detail.key === 'products') {
        loadData();
      }
    };
    
    window.addEventListener('dataUpdated', handleDataUpdate);
    return () => window.removeEventListener('dataUpdated', handleDataUpdate);
  }, []);

  const loadData = async () => {
    const [categoriesData, productsData] = await Promise.all([
      getCategories(),
      getProducts()
    ]);
    setCategories(categoriesData || []);
    setProducts(productsData || []);
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
    
    let updatedCategories;
    
    if (editingId) {
      // Update existing category
      updatedCategories = categories.map(cat => 
        cat.id === editingId ? { ...formData, id: editingId } : cat
      );
    } else {
      // Add new category
      const newCategory = {
        ...formData,
        id: formData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      };
      updatedCategories = [...categories, newCategory];
    }
    
    setCategories(updatedCategories);
    await saveCategories(updatedCategories);
    
    setFormData({ id: '', name: '', description: '' });
    setIsAdding(false);
    setEditingId(null);
  };

  const handleEdit = (category) => {
    setFormData(category);
    setEditingId(category.id);
    setIsAdding(true);
  };

  const handleDelete = async (id) => {
    // Check if any products use this category
    const productsInCategory = products.filter(p => p.category === id);
    
    if (productsInCategory.length > 0) {
      const confirmMsg = `This category has ${productsInCategory.length} product(s). These products will be moved to "Uncategorized". Continue?`;
      if (!window.confirm(confirmMsg)) {
        return;
      }
      
      // Move products to uncategorized
      const updatedProducts = products.map(p => 
        p.category === id ? { ...p, category: 'uncategorized' } : p
      );
      setProducts(updatedProducts);
      await saveProducts(updatedProducts);
    } else {
      if (!window.confirm('Are you sure you want to delete this category?')) {
        return;
      }
    }
    
    const updatedCategories = categories.filter(cat => cat.id !== id);
    setCategories(updatedCategories);
    await saveCategories(updatedCategories);
  };

  const handleCancel = () => {
    setFormData({ id: '', name: '', description: '' });
    setIsAdding(false);
    setEditingId(null);
  };

  // Count products per category
  const getProductCount = (categoryId) => {
    if (!Array.isArray(products)) return 0;
    return products.filter(p => p.category === categoryId).length;
  };

  return (
    <div>
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
                Category Name
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
                Description
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
            {/* Uncategorized (default) */}
            <tr className="hover:bg-gray-50 bg-yellow-50">
              <td className="px-6 py-4 font-medium text-gray-900">
                Uncategorized
                <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Default</span>
              </td>
              <td className="px-6 py-4 text-gray-600">Products without a category</td>
              <td className="px-6 py-4 text-center">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {getProductCount('uncategorized')}
                </span>
              </td>
              <td className="px-6 py-4 text-right text-gray-400">
                Cannot delete
              </td>
            </tr>
            
            {currentData.map((category) => (
              <tr key={category.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">{category.name}</td>
                <td className="px-6 py-4 text-gray-600">{category.description}</td>
                <td className="px-6 py-4 text-center">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    {getProductCount(category.id)}
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
                    onClick={() => handleDelete(category.id)}
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
