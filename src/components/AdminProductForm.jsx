import { useState, useEffect } from 'react';

function AdminProductForm({ product, onSave, onCancel }) {
  // Initialize form data with product data or empty defaults
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    imageUrl: '',
    variants: []
  });

  // Validation errors
  const [errors, setErrors] = useState({
    name: '',
    description: ''
  });

  // Image preview error state
  const [imageError, setImageError] = useState(false);

  // New variant state
  const [newVariant, setNewVariant] = useState({
    name: '',
    specifications: {}
  });

  // New specification field state
  const [newSpecKey, setNewSpecKey] = useState('');
  const [newSpecValue, setNewSpecValue] = useState('');

  // Editing variant state
  const [editingVariantId, setEditingVariantId] = useState(null);

  // Update formData when product prop changes
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        imageUrl: product.imageUrl || '',
        variants: product.variants || []
      });
    } else {
      setFormData({
        name: '',
        description: '',
        imageUrl: '',
        variants: []
      });
    }
    // Clear errors when product changes
    setErrors({ name: '', description: '' });
  }, [product]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Reset image error when imageUrl changes
    if (name === 'imageUrl') {
      setImageError(false);
    }
  };

  // Handle image load error
  const handleImageError = () => {
    setImageError(true);
  };

  // Add specification to new variant
  const addSpecification = () => {
    const trimmedKey = newSpecKey.trim();
    const trimmedValue = newSpecValue.trim();

    if (trimmedKey && trimmedValue) {
      setNewVariant(prev => ({
        ...prev,
        specifications: {
          ...prev.specifications,
          [trimmedKey]: trimmedValue
        }
      }));
      setNewSpecKey('');
      setNewSpecValue('');
    }
  };

  // Remove specification from new variant
  const removeSpecification = (key) => {
    setNewVariant(prev => {
      const newSpecs = { ...prev.specifications };
      delete newSpecs[key];
      return {
        ...prev,
        specifications: newSpecs
      };
    });
  };

  // Add variant to product
  const addVariant = () => {
    const trimmedName = newVariant.name.trim();

    if (trimmedName) {
      const variant = {
        id: `v${Date.now()}`,
        name: trimmedName,
        specifications: newVariant.specifications
      };

      setFormData(prev => ({
        ...prev,
        variants: [...prev.variants, variant]
      }));

      // Reset new variant form
      setNewVariant({
        name: '',
        specifications: {}
      });
    }
  };

  // Delete variant from product
  const deleteVariant = (variantId) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.filter(v => v.id !== variantId)
    }));
  };

  // Start editing a variant
  const startEditVariant = (variant) => {
    setEditingVariantId(variant.id);
    setNewVariant({
      name: variant.name,
      specifications: { ...variant.specifications }
    });
  };

  // Save edited variant
  const saveEditedVariant = () => {
    const trimmedName = newVariant.name.trim();

    if (trimmedName && editingVariantId) {
      setFormData(prev => ({
        ...prev,
        variants: prev.variants.map(v =>
          v.id === editingVariantId
            ? { ...v, name: trimmedName, specifications: newVariant.specifications }
            : v
        )
      }));

      // Reset editing state
      setEditingVariantId(null);
      setNewVariant({
        name: '',
        specifications: {}
      });
    }
  };

  // Cancel editing variant
  const cancelEditVariant = () => {
    setEditingVariantId(null);
    setNewVariant({
      name: '',
      specifications: {}
    });
  };

  // Validate form fields
  const validateForm = () => {
    const newErrors = {};
    
    const trimmedName = formData.name.trim();
    const trimmedDescription = formData.description.trim();

    if (!trimmedName) {
      newErrors.name = 'Product name is required';
    }

    if (!trimmedDescription) {
      newErrors.description = 'Product description is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Check if form is valid
  const isFormValid = () => {
    return formData.name.trim() !== '' && formData.description.trim() !== '';
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      // Trim whitespace from form data
      const cleanedData = {
        ...formData,
        name: formData.name.trim(),
        description: formData.description.trim(),
        imageUrl: formData.imageUrl.trim()
      };

      onSave(cleanedData);

      // Reset form if creating new product (not editing)
      if (!product) {
        setFormData({
          name: '',
          description: '',
          imageUrl: '',
          variants: []
        });
        setErrors({ name: '', description: '' });
        setImageError(false);
      }
    }
  };

  // Handle cancel
  const handleCancel = () => {
    // Reset form
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        imageUrl: product.imageUrl || '',
        variants: product.variants || []
      });
    } else {
      setFormData({
        name: '',
        description: '',
        imageUrl: '',
        variants: []
      });
    }
    setErrors({ name: '', description: '' });
    setImageError(false);
    setNewVariant({ name: '', specifications: {} });
    setEditingVariantId(null);
    
    onCancel();
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
        {product ? 'Edit Product' : 'Add New Product'}
      </h2>
      
      <form className="space-y-4 sm:space-y-6">
        {/* Product Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Product Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className={`w-full px-3 sm:px-4 py-2 text-base border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter product name"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
          )}
        </div>

        {/* Product Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows="4"
            className={`w-full px-3 sm:px-4 py-2 text-base border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.description ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter product description"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description}</p>
          )}
        </div>

        {/* Image URL */}
        <div>
          <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-2">
            Image URL
          </label>
          <input
            type="text"
            id="imageUrl"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleInputChange}
            className="w-full px-3 sm:px-4 py-2 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter image URL (optional)"
          />
          
          {/* Image Preview */}
          {formData.imageUrl && !imageError && (
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Image Preview:</p>
              <div className="w-full max-w-md aspect-video bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={formData.imageUrl}
                  alt="Product preview"
                  className="w-full h-full object-cover"
                  onError={handleImageError}
                />
              </div>
            </div>
          )}
          
          {imageError && formData.imageUrl && (
            <p className="mt-2 text-sm text-amber-600">
              Unable to load image. Please check the URL.
            </p>
          )}
        </div>

        {/* Variants Section */}
        <div className="border-t pt-4 sm:pt-6">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Product Variants</h3>

          {/* Existing Variants */}
          {formData.variants.length > 0 && (
            <div className="space-y-4 mb-6">
              {formData.variants.map((variant) => (
                <div key={variant.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-gray-900">{variant.name}</h4>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => startEditVariant(variant)}
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteVariant(variant.id)}
                        className="text-sm text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  {Object.keys(variant.specifications).length > 0 && (
                    <div className="mt-2 space-y-1">
                      {Object.entries(variant.specifications).map(([key, value]) => (
                        <div key={key} className="text-sm">
                          <span className="font-medium text-gray-700">{key}:</span>{' '}
                          <span className="text-gray-600">{value}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Add/Edit Variant Form */}
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <h4 className="font-semibold text-gray-900 mb-4">
              {editingVariantId ? 'Edit Variant' : 'Add New Variant'}
            </h4>

            {/* Variant Name */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Variant Name *
              </label>
              <input
                type="text"
                value={newVariant.name}
                onChange={(e) => setNewVariant(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 sm:px-4 py-2 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Industrial Grade"
              />
            </div>

            {/* Specifications */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Specifications
              </label>

              {/* Existing Specifications */}
              {Object.keys(newVariant.specifications).length > 0 && (
                <div className="space-y-2 mb-3">
                  {Object.entries(newVariant.specifications).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between bg-white rounded px-3 py-2 border border-gray-300">
                      <span className="text-sm">
                        <span className="font-medium text-gray-700">{key}:</span>{' '}
                        <span className="text-gray-600">{value}</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => removeSpecification(key)}
                        className="text-sm text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add Specification Fields */}
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={newSpecKey}
                  onChange={(e) => setNewSpecKey(e.target.value)}
                  className="flex-1 px-3 py-2 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Key (e.g., Material)"
                />
                <input
                  type="text"
                  value={newSpecValue}
                  onChange={(e) => setNewSpecValue(e.target.value)}
                  className="flex-1 px-3 py-2 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Value (e.g., Copper)"
                />
                <button
                  type="button"
                  onClick={addSpecification}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Variant Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2">
              {editingVariantId ? (
                <>
                  <button
                    type="button"
                    onClick={saveEditedVariant}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Save Variant
                  </button>
                  <button
                    type="button"
                    onClick={cancelEditVariant}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={addVariant}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Add Variant
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Form Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6 border-t">
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={!isFormValid()}
            className={`w-full sm:flex-1 px-6 py-3 rounded-lg font-semibold transition-colors ${
              isFormValid()
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {product ? 'Update Product' : 'Create Product'}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="w-full sm:flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default AdminProductForm;
