import { useState } from 'react';

function VariantManager({ variants, onChange }) {
  const [localVariants, setLocalVariants] = useState(variants || [{ capacity: '', name: '', price: '', mrp: '', specifications: {} }]);

  const handleAddVariant = () => {
    const newVariants = [...localVariants, { capacity: '', name: '', price: '', mrp: '', specifications: {} }];
    setLocalVariants(newVariants);
    onChange(newVariants);
  };

  const handleRemoveVariant = (index) => {
    if (localVariants.length <= 1) return; // Prevent removal of last variant
    const newVariants = localVariants.filter((_, i) => i !== index);
    setLocalVariants(newVariants);
    onChange(newVariants);
  };

  const handleVariantChange = (index, field, value) => {
    const newVariants = [...localVariants];
    newVariants[index][field] = value;
    setLocalVariants(newVariants);
    onChange(newVariants);
  };

  const handleSpecificationChange = (variantIndex, specKey, specValue) => {
    const newVariants = [...localVariants];
    if (!newVariants[variantIndex].specifications) {
      newVariants[variantIndex].specifications = {};
    }
    newVariants[variantIndex].specifications[specKey] = specValue;
    setLocalVariants(newVariants);
    onChange(newVariants);
  };

  const handleAddSpecification = (variantIndex) => {
    const newVariants = [...localVariants];
    if (!newVariants[variantIndex].specifications) {
      newVariants[variantIndex].specifications = {};
    }
    // Add empty specification
    const specCount = Object.keys(newVariants[variantIndex].specifications).length;
    newVariants[variantIndex].specifications[`spec${specCount + 1}`] = '';
    setLocalVariants(newVariants);
    onChange(newVariants);
  };

  const handleRemoveSpecification = (variantIndex, specKey) => {
    const newVariants = [...localVariants];
    delete newVariants[variantIndex].specifications[specKey];
    setLocalVariants(newVariants);
    onChange(newVariants);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Product Variants</h3>
        <button
          type="button"
          onClick={handleAddVariant}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm"
        >
          + Add Variant
        </button>
      </div>

      {localVariants.map((variant, index) => (
        <div key={index} className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-gray-700">Variant {index + 1}</h4>
            <button
              type="button"
              onClick={() => handleRemoveVariant(index)}
              disabled={localVariants.length <= 1}
              className={`text-sm px-3 py-1 rounded ${
                localVariants.length <= 1
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-red-600 text-white hover:bg-red-700'
              }`}
            >
              Remove
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Capacity <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={variant.capacity}
                onChange={(e) => handleVariantChange(index, 'capacity', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 6A, 10A, 16A"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Variant Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={variant.name}
                onChange={(e) => handleVariantChange(index, 'name', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 6A MCB"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price (₹) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={variant.price}
                onChange={(e) => handleVariantChange(index, 'price', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 245"
                min="0"
                step="0.01"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                MRP (₹)
              </label>
              <input
                type="number"
                value={variant.mrp}
                onChange={(e) => handleVariantChange(index, 'mrp', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 300"
                min="0"
                step="0.01"
              />
            </div>
          </div>

          {/* Specifications Section */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">Specifications</label>
              <button
                type="button"
                onClick={() => handleAddSpecification(index)}
                className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200"
              >
                + Add Spec
              </button>
            </div>
            
            <div className="space-y-2">
              {variant.specifications && Object.entries(variant.specifications).map(([key, value]) => (
                <div key={key} className="flex gap-2">
                  <input
                    type="text"
                    value={key}
                    onChange={(e) => {
                      const newKey = e.target.value;
                      const newVariants = [...localVariants];
                      const specs = { ...newVariants[index].specifications };
                      delete specs[key];
                      specs[newKey] = value;
                      newVariants[index].specifications = specs;
                      setLocalVariants(newVariants);
                      onChange(newVariants);
                    }}
                    className="flex-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                    placeholder="Key (e.g., Poles)"
                  />
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => handleSpecificationChange(index, key, e.target.value)}
                    className="flex-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                    placeholder="Value (e.g., 2P)"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveSpecification(index, key)}
                    className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 text-sm"
                  >
                    ×
                  </button>
                </div>
              ))}
              
              {(!variant.specifications || Object.keys(variant.specifications).length === 0) && (
                <p className="text-xs text-gray-500 italic">No specifications added yet</p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default VariantManager;
