import { useState, useEffect } from 'react';
import { getDistributors, saveDistributors } from '../../utils/dataManager';
import { uploadImage, validateImageFile, deleteImage } from '../../utils/imageUpload';
import Toast from '../Toast';
import AdminSearchBar from './AdminSearchBar';
import AdminPagination from './AdminPagination';
import useAdminTable from '../../hooks/useAdminTable';

function DistributorManagement() {
  const [distributors, setDistributors] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState(null);
  const [pendingFiles, setPendingFiles] = useState({});
  const [oldImages, setOldImages] = useState({});
  const [imagesToDelete, setImagesToDelete] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    logo: '/distributors/logo.png',
    image: '/distributors/store.jpg',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    established: '',
    coverage: ''
  });

  // Load data on mount
  useEffect(() => {
    loadData();
    
    // Listen for data updates
    const handleDataUpdate = (event) => {
      if (event.detail.key === 'distributors') {
        loadData();
      }
    };
    
    window.addEventListener('dataUpdated', handleDataUpdate);
    return () => window.removeEventListener('dataUpdated', handleDataUpdate);
  }, []);

  const loadData = async () => {
    const distributorsData = await getDistributors();
    setDistributors(distributorsData || []);
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
  } = useAdminTable(distributors, {
    searchFields: ['name', 'contactPerson', 'city', 'state'],
    defaultSortField: 'name',
    defaultSortOrder: 'asc',
    defaultItemsPerPage: 10
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setUploading(true);
      
      const coverageArray = formData.coverage.split(',').map(s => s.trim());
      
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
      
      let updatedDistributors;
      
      if (editingId) {
        updatedDistributors = distributors.map(d => 
          d.id === editingId ? { ...uploadedData, id: editingId, coverage: coverageArray } : d
        );
        setEditingId(null);
      } else {
        const newDistributor = {
          ...uploadedData,
          id: `dist-${Date.now()}`,
          coverage: coverageArray
        };
        updatedDistributors = [...distributors, newDistributor];
      }
      
      setDistributors(updatedDistributors);
      await saveDistributors(updatedDistributors);
      setToast({ message: 'Distributor saved successfully!', type: 'success' });
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
      logo: '/distributors/logo.png',
      image: '/distributors/store.jpg',
      contactPerson: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      pincode: '',
      established: '',
      coverage: ''
    });
    setPendingFiles({});
    setOldImages({});
    setImagesToDelete([]);
    setIsAdding(false);
    setEditingId(null);
  };

  const handleEdit = (distributor) => {
    setFormData({
      ...distributor,
      coverage: distributor.coverage.join(', ')
    });
    setOldImages({
      logo: distributor.logo,
      image: distributor.image
    });
    setPendingFiles({});
    setImagesToDelete([]);
    setEditingId(distributor.id);
    setIsAdding(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this distributor?')) {
      const distributor = distributors.find(d => d.id === id);
      
      // Delete associated images
      if (distributor) {
        const imageFields = ['logo', 'image'];
        for (const field of imageFields) {
          if (distributor[field] && distributor[field].startsWith('/uploads/')) {
            await deleteImage(distributor[field]);
          }
        }
      }
      
      const updatedDistributors = distributors.filter(d => d.id !== id);
      setDistributors(updatedDistributors);
      await saveDistributors(updatedDistributors);
      setToast({ message: 'Distributor deleted successfully!', type: 'success' });
    }
  };

  // Handle image file selection (store file temporarily)
  const handleImageUpload = (e, field) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      validateImageFile(file);
      
      // Store file for later upload
      setPendingFiles({ ...pendingFiles, [field]: file });
      
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setFormData({ ...formData, [field]: previewUrl });
      
      setToast({ message: 'Image selected. Click Add/Update to save.', type: 'success' });
    } catch (error) {
      setToast({ message: `Invalid file: ${error.message}`, type: 'error' });
    }
  };

  // Handle image removal
  const handleImageRemove = (field) => {
    const defaultValue = field === 'logo' ? '/distributors/logo.png' : '/distributors/store.jpg';
    
    // Mark old uploaded image for deletion (will be deleted on submit)
    if (editingId && oldImages[field] && oldImages[field].startsWith('/uploads/')) {
      setImagesToDelete([...imagesToDelete, oldImages[field]]);
    }
    
    // Clear pending file
    const newPendingFiles = { ...pendingFiles };
    delete newPendingFiles[field];
    setPendingFiles(newPendingFiles);
    
    // Reset to default
    setFormData({ ...formData, [field]: defaultValue });
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
        <h1 className="text-2xl font-bold text-gray-900">Distributor Management</h1>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            + Add Distributor
          </button>
        )}
      </div>

      {isAdding && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">
            {editingId ? 'Edit Distributor' : 'Add New Distributor'}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Distributor Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Contact Person</label>
              <input
                type="text"
                value={formData.contactPerson}
                onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
              <textarea
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
                rows="2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
              <input
                type="text"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Pincode</label>
              <input
                type="text"
                value={formData.pincode}
                onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Established Year</label>
              <input
                type="text"
                value={formData.established}
                onChange={(e) => setFormData({ ...formData, established: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="2015"
                required
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Coverage Areas (comma-separated)</label>
              <input
                type="text"
                value={formData.coverage}
                onChange={(e) => setFormData({ ...formData, coverage: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="Delhi, NCR, Haryana"
                required
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Distributor Images
              </label>
              <div className="grid grid-cols-2 gap-4">
                {/* Logo Upload */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-400 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-gray-700">Logo</span>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">Optional</span>
                  </div>
                  
                  {formData.logo && formData.logo !== '/distributors/logo.png' ? (
                    <div className="mb-3">
                      <img src={formData.logo} alt="Logo preview" className="w-full h-32 object-contain bg-gray-50 rounded" onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }} />
                      <div className="hidden w-full h-32 bg-gray-50 rounded items-center justify-center text-gray-400">
                        <span className="text-4xl">🏢</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleImageRemove('logo')}
                        className="mt-2 w-full text-xs text-red-600 hover:text-red-800"
                      >
                        Remove Logo
                      </button>
                    </div>
                  ) : (
                    <div className="mb-3 h-32 bg-gray-50 rounded flex items-center justify-center text-gray-400">
                      <span className="text-4xl">🏢</span>
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <label className="block">
                      <span className="sr-only">Choose file</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, 'logo')}
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
                      value={formData.logo === '/distributors/logo.png' ? '' : formData.logo}
                      onChange={(e) => setFormData({ ...formData, logo: e.target.value || '/distributors/logo.png' })}
                      className="w-full px-3 py-2 text-xs border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter image URL"
                    />
                  </div>
                </div>

                {/* Store Image Upload */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-400 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-gray-700">Store Image</span>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">Optional</span>
                  </div>
                  
                  {formData.image && formData.image !== '/distributors/store.jpg' ? (
                    <div className="mb-3">
                      <img src={formData.image} alt="Store preview" className="w-full h-32 object-cover bg-gray-50 rounded" onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }} />
                      <div className="hidden w-full h-32 bg-gray-50 rounded items-center justify-center text-gray-400">
                        <span className="text-4xl">🏪</span>
                      </div>
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
                      <span className="text-4xl">🏪</span>
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
                      value={formData.image === '/distributors/store.jpg' ? '' : formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value || '/distributors/store.jpg' })}
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

            <div className="col-span-2 flex gap-3">
              <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                {editingId ? 'Update' : 'Add'} Distributor
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
        placeholder="Search distributors..."
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('city')}
              >
                <div className="flex items-center gap-1">
                  Location
                  {sortField === 'city' && (
                    <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>
                  )}
                </div>
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {currentData.map((distributor) => (
              <tr key={distributor.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium">{distributor.name}</td>
                <td className="px-6 py-4">
                  <div className="text-sm">{distributor.contactPerson}</div>
                  <div className="text-xs text-gray-500">{distributor.email}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm">{distributor.city}, {distributor.state}</div>
                </td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => handleEdit(distributor)} className="text-blue-600 hover:text-blue-800 mr-4">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(distributor.id)} className="text-red-600 hover:text-red-800">
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

export default DistributorManagement;
