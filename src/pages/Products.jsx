import { useState } from 'react';
import { Link } from 'react-router-dom';
import { getProductsData } from '../utils/dataManager';
import ImageWithFallback from '../components/ImageWithFallback';
import DynamicBanner from '../components/DynamicBanner';

function Products() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filterOpen, setFilterOpen] = useState(false);
  const { categories, products } = getProductsData();

  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(p => p.category === selectedCategory);

  const getCategoryName = (categoryId) => {
    const cat = categories.find(c => c.id === categoryId);
    return cat ? cat.name : 'Unknown Category';
  };

  const allCategories = [{ id: 'all', name: 'All Products' }, ...categories];

  const scrollToTop = () => {
    const isMobile = window.innerWidth < 640;
    window.scrollTo({ top: isMobile ? 200 : 350, behavior: 'smooth' });
  };

  const handleSelect = (id) => {
    setSelectedCategory(id);
    setFilterOpen(false);
    scrollToTop();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DynamicBanner page="products" compact />

      {/* ── DESKTOP: centered wrap pills ── */}
      <section className="bg-white border-b shadow-sm hidden sm:block sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-wrap justify-center gap-2">
            {allCategories.map(cat => (
              <button
                key={cat.id}
                onClick={() => { setSelectedCategory(cat.id); scrollToTop(); }}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 border ${
                  selectedCategory === cat.id
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-blue-400 hover:text-blue-600'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── MOBILE: sticky filter bar ── */}
      <div className="sm:hidden sticky top-0 z-40 bg-white border-b shadow-sm px-4 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-xs text-gray-400 font-medium uppercase tracking-wide shrink-0">Category:</span>
          <span className="text-sm font-bold text-blue-600 truncate">
            {getCategoryName(selectedCategory) === 'Unknown Category' ? 'All Products' : (selectedCategory === 'all' ? 'All Products' : getCategoryName(selectedCategory))}
          </span>
        </div>
        <button
          onClick={() => setFilterOpen(true)}
          className="shrink-0 flex items-center gap-1.5 bg-blue-600 text-white text-xs font-bold px-3 py-2 rounded-lg shadow"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
            <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm2 4a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm2 4a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1z" clipRule="evenodd"/>
          </svg>
          Filter
        </button>
      </div>

      {/* ── MOBILE: filter bottom-sheet popup ── */}
      {filterOpen && (
        <div className="sm:hidden fixed inset-0 z-50 flex flex-col justify-end">
          {/* backdrop */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setFilterOpen(false)} />
          {/* sheet */}
          <div className="relative bg-white rounded-t-3xl px-5 pt-5 pb-8 shadow-2xl max-h-[80vh] overflow-y-auto">
            {/* handle */}
            <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-5" />
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-black text-gray-900">Filter by Category</h3>
              <button onClick={() => setFilterOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500">✕</button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {allCategories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => handleSelect(cat.id)}
                  className={`relative flex flex-col items-start p-4 rounded-2xl border-2 text-left transition-all duration-200 ${
                    selectedCategory === cat.id
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-100 bg-gray-50 hover:border-blue-200'
                  }`}
                >
                  {selectedCategory === cat.id && (
                    <span className="absolute top-2 right-2 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                      <svg viewBox="0 0 12 12" fill="white" className="w-3 h-3"><path d="M2 6l3 3 5-5"/></svg>
                    </span>
                  )}
                  <span className={`text-xs font-black uppercase tracking-wide mb-1 ${selectedCategory === cat.id ? 'text-blue-600' : 'text-gray-400'}`}>
                    {cat.id === 'all' ? '★' : cat.id.slice(0, 3).toUpperCase()}
                  </span>
                  <span className={`text-sm font-bold leading-tight ${selectedCategory === cat.id ? 'text-blue-700' : 'text-gray-700'}`}>
                    {cat.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Products Grid */}
      <section className="py-8 sm:py-12">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {selectedCategory === 'all' ? 'All Products' : getCategoryName(selectedCategory)}
            </h2>
            <p className="text-gray-600 mt-1">{filteredProducts.length} products available</p>
          </div>

          <div className="flex flex-wrap justify-center gap-6">
            {filteredProducts.map(product => (
              <Link
                key={product.id}
                to={`/products/${product.id}`}
                className="group bg-white rounded-xl border border-gray-200 hover:border-blue-400 transition-all duration-300 hover:shadow-xl overflow-hidden w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] xl:w-[calc(25%-18px)] max-w-sm"
              >
                <div className="relative bg-gray-50 aspect-square flex items-center justify-center p-6 overflow-hidden">
                  <ImageWithFallback
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {product.name}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">{getCategoryName(product.category)}</span>
                  </div>
                  <div className="mt-2 text-sm text-blue-600 font-medium group-hover:translate-x-1 transition-transform">
                    View Details →
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-16">
              <div className="text-gray-400 text-6xl mb-4">📦</div>
              <h3 className="text-2xl font-semibold text-gray-700 mb-2">No Products Found</h3>
              <p className="text-gray-600">Try selecting a different category</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default Products;
