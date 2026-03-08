import { useState } from 'react';
import ProductVariant from './ProductVariant';

function ProductCard({ product }) {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const imageSrc = imageError || !product.imageUrl 
    ? '/placeholder.png' 
    : product.imageUrl;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="aspect-video w-full overflow-hidden bg-gray-100">
        <img
          src={imageSrc}
          alt={product.name}
          className="w-full h-full object-cover"
          onError={handleImageError}
        />
      </div>
      
      <div className="p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">{product.name}</h2>
        <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">{product.description}</p>
        
        {product.variants && product.variants.length > 0 && (
          <div className="space-y-2 sm:space-y-3">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800">Variants</h3>
            {product.variants.map((variant) => (
              <ProductVariant key={variant.id} variant={variant} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductCard;
