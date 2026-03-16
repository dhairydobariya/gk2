import { useState, useEffect } from 'react';
import { distributorAPI } from '../../utils/api';
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
    logoUrl: '',
    imageUrl: '',
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

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const result = await distributorAPI.getAll();
      if (result.success) {
        setDistributors(result.data || []);
      }
    } catch (error) {
      console.error('Error loading distributors:', error);
      setToast({ message: 'Failed to load distributors', type: 'error' });
    }
  };

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
      
      const coverageArray = formData.coverage.split(',').map(s => s.trim()).filter(s => s);
      
      const uploadedData = { ...formData };
      for (const [field, file] of Object.entries(pendingFiles)) {
        if (file) {
          const imageUrl = await uploadImage(file);
          uploadedData[field] = imageUrl;
        }
      }
      
      for (const imageUrl of imagesToDelete) {
        await deleteImage(imageUrl);
      }
      
      const distributorData = {
        name: uploadedData.name,
        logoUrl: uploadedData.logoUrl || '',
        imageUrl: uploadedData.imageUrl || '',
        contactPerson: uploadedData.contactPerson,
        email: uploadedData.email,
        phone: uploadedData.phone,
        address: uploadedData.address,
        city: uploadedData.city,
        state: uploadedData.state,
        pincode: uploadedData.pincode,
        established: uploadedData.established,
        coverage: coverageArray
      };
      
      let result;
      if (editingId) {
        result = await distributorAPI.update(editingId, distributorData);
      } else {
        result = await distributorAPI.create(distributorData);
      }
      
      if (result.success) {
        setToast({ message: editingId ? 'Distributor updated!' : 'Distributor created!', type: 'success' });
        await loadData();
        resetForm();
      } else {
        setToast({ message: result.message || 'Failed to save', type: 'error' });
      }
    } catch (error) {
      setToast({ message: `Failed: ${error.message}`, type: 'error' });
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '', logoUrl: '', imageUrl: '', contactPerson: '', email: '', phone: '',
      address: '', city: '', state: '', pincode: '', established: '', coverage: ''
    });
    setPendingFiles({});
    setOldImages({});
    setImagesToDelete([]);
    setIsAdding(false);
    setEditingId(null);
  };

  const handleEdit = (distributor) => {
    setFormData({
      name: distributor.name,
      logoUrl: distributor.logoUrl || '',
      imageUrl: distributor.imageUrl || '',
      contactPerson: distributor.contactPerson,
      email: distributor.email,
      phone: distributor.phone,
      address: distributor.address,
      city: distributor.city,
      state: distributor.state,
      pincode: distributor.pincode,
      established: distributor.established,
      coverage: Array.isArray(distributor.coverage) ? distributor.coverage.join(', ') : ''
    });
    setOldImages({ logoUrl: distributor.logoUrl, imageUrl: distributor.imageUrl });
    setPendingFiles({});
    setImagesToDelete([]);
    setEditingId(distributor._id);
    setIsAdding(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this distributor?')) {
      try {
        const result = await distributorAPI.delete(id);
        if (result.success) {
          setToast({ message: 'Deleted!', type: 'success' });
          await loadData();
        } else {
          setToast({ message: result.message || 'Failed', type: 'error' });
        }
      } catch (error) {
        setToast({ message: `Failed: ${error.message}`, type: 'error' });
      }
    }
  };

  const handleImageUpload = (e, field) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      validateImageFile(file);
      setPendingFiles({ ...pendingFiles, [field]: file });
      setFormData({ ...formData, [field]: URL.createObjectURL(file) });
      setToast({ message: 'Image selected', type: 'success' });
    } catch (error) {
      setToast({ message: `Invalid: ${error.message}`, type: 'error' });
    }
  };

  const handleImageRemove = (field) => {
    if (editingId && oldImages[field] && oldImages[field].startsWith('/uploads/')) {
      setImagesToDelete([...imagesToDelete, oldImages[field]]);
    }
    const newPendingFiles = { ...pendingFiles };
    delete newPendingFiles[field];
    setPendingFiles(newPendingFiles);
    setFormData({ ...formData, [field]: '' });
  };

  return (
    <div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Distributor Management</h1>
        {!isAdding && <button onClick={() => setIsAdding(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">+ Add</button>}
      </div>

      {isAdding && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">{editingId ? 'Edit' : 'Add'} Distributor</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium mb-2">Name *</label><input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-2 border rounded-lg" required /></div>
            <div><label className="block text-sm font-medium mb-2">Contact Person *</label><input type="text" value={formData.contactPerson} onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })} className="w-full px-4 py-2 border rounded-lg" required /></div>
            <div><label className="block text-sm font-medium mb-2">Email *</label><input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-2 border rounded-lg" required /></div>
            <div><label className="block text-sm font-medium mb-2">Phone *</label><input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full px-4 py-2 border rounded-lg" required /></div>
            <div className="col-span-2"><label className="block text-sm font-medium mb-2">Address *</label><textarea value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className="w-full px-4 py-2 border rounded-lg" rows="2" required /></div>
            <div><label className="block text-sm font-medium mb-2">City *</label><input type="text" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} className="w-full px-4 py-2 border rounded-lg" required /></div>
            <div><label className="block text-sm font-medium mb-2">State *</label><input type="text" value={formData.state} onChange={(e) => setFormData({ ...formData, state: e.target.value })} className="w-full px-4 py-2 border rounded-lg" required /></div>
            <div><label className="block text-sm font-medium mb-2">Pincode *</label><input type="text" value={formData.pincode} onChange={(e) => setFormData({ ...formData, pincode: e.target.value })} className="w-full px-4 py-2 border rounded-lg" required /></div>
            <div><label className="block text-sm font-medium mb-2">Established *</label><input type="text" value={formData.established} onChange={(e) => setFormData({ ...formData, established: e.target.value })} className="w-full px-4 py-2 border rounded-lg" placeholder="2015" required /></div>
            <div className="col-span-2"><label className="block text-sm font-medium mb-2">Coverage *</label><input type="text" value={formData.coverage} onChange={(e) => setFormData({ ...formData, coverage: e.target.value })} className="w-full px-4 py-2 border rounded-lg" placeholder="Delhi, NCR" required /></div>
            
            <div className="col-span-2 grid grid-cols-2 gap-4">
              <div className="border-2 border-dashed p-4 rounded-lg">
                <span className="text-sm font-medium">Logo</span>
                {formData.logoUrl ? <div><img src={formData.logoUrl} alt="Logo" className="w-full h-32 object-contain my-2" /><button type="button" onClick={() => handleImageRemove('logoUrl')} className="text-xs text-red-600">Remove</button></div> : <div className="h-32 bg-gray-50 rounded flex items-center justify-center my-2">🏢</div>}
                <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'logoUrl')} className="block w-full text-xs mt-2" disabled={uploading} />
              </div>
              <div className="border-2 border-dashed p-4 rounded-lg">
                <span className="text-sm font-medium">Store Image</span>
                {formData.imageUrl ? <div><img src={formData.imageUrl} alt="Store" className="w-full h-32 object-cover my-2" /><button type="button" onClick={() => handleImageRemove('imageUrl')} className="text-xs text-red-600">Remove</button></div> : <div className="h-32 bg-gray-50 rounded flex items-center justify-center my-2">🏪</div>}
                <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'imageUrl')} className="block w-full text-xs mt-2" disabled={uploading} />
              </div>
            </div>

            <div className="col-span-2 flex gap-3">
              <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg" disabled={uploading}>{uploading ? 'Saving...' : (editingId ? 'Update' : 'Add')}</button>
              <button type="button" onClick={resetForm} className="bg-gray-200 px-6 py-2 rounded-lg" disabled={uploading}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <AdminSearchBar searchQuery={searchQuery} onSearchChange={handleSearchChange} placeholder="Search..." />

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase cursor-pointer" onClick={() => handleSort('name')}>Name {sortField === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase">Contact</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase cursor-pointer" onClick={() => handleSort('city')}>Location {sortField === 'city' && (sortOrder === 'asc' ? '↑' : '↓')}</th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {currentData.map((d) => (
              <tr key={d._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium">{d.name}</td>
                <td className="px-6 py-4"><div className="text-sm">{d.contactPerson}</div><div className="text-xs text-gray-500">{d.email}</div></td>
                <td className="px-6 py-4 text-sm">{d.city}, {d.state}</td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => handleEdit(d)} className="text-blue-600 hover:text-blue-800 mr-4">Edit</button>
                  <button onClick={() => handleDelete(d._id)} className="text-red-600 hover:text-red-800">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <AdminPagination currentPage={currentPage} totalPages={totalPages} itemsPerPage={itemsPerPage} totalItems={totalItems} onPageChange={handlePageChange} onItemsPerPageChange={handleItemsPerPageChange} />
      </div>
    </div>
  );
}

export default DistributorManagement;
