function ProductVariant({ variant }) {
  return (
    <div className="bg-gray-50 rounded-lg p-3 sm:p-4 border border-gray-200">
      <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2 sm:mb-3">{variant.name}</h3>
      <div className="space-y-1 sm:space-y-2">
        {Object.entries(variant.specifications).map(([key, value]) => (
          <div key={key} className="flex flex-col sm:flex-row sm:justify-between text-sm gap-0.5 sm:gap-2">
            <span className="font-medium text-gray-600">{key}:</span>
            <span className="text-gray-800 sm:text-right">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductVariant;
