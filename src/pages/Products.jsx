import { useState, useMemo, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getProductsData } from '../utils/dataManager';
import DynamicBanner from '../components/DynamicBanner';
import useSEO from '../hooks/useSEO';

// Inject keyframes once
const STYLE = `
@keyframes cardIn {
  from { opacity: 0; transform: translateY(16px) scale(0.97); }
  to   { opacity: 1; transform: translateY(0)   scale(1); }
}
.card-animate {
  animation: cardIn 0.3s ease both;
}
`;

// Full skeleton card — same dimensions as real card
function ProductSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] xl:w-[calc(25%-18px)] max-w-sm animate-pulse">
      <div className="aspect-square bg-gradient-to-br from-slate-100 to-blue-50" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-200 rounded-lg w-3/4" />
        <div className="h-3 bg-gray-100 rounded-lg w-1/2" />
        <div className="h-3 bg-blue-50 rounded-lg w-1/3" />
      </div>
    </div>
  );
}

// Product card that shows skeleton until image loads
function ProductCard({ product, idx, getCategoryName, animDelay = 0 }) {
  // Check if image is already cached — skip skeleton if so
  const [loaded, setLoaded] = useState(() => {
    if (!product.image) return false;
    const img = new window.Image();
    img.src = product.image;
    return img.complete && img.naturalWidth > 0;
  });
  const [error, setError] = useState(false);

  // Only reset when the image src actually changes (not on every remount)
  const prevSrc = useState(product.image)[0];
  useEffect(() => {
    if (product.image !== prevSrc) { setLoaded(false); setError(false); }
  }, [product.image]);

  return (
    <div
      className="card-animate relative w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] xl:w-[calc(25%-18px)] max-w-sm"
      style={{ animationDelay: `${animDelay}ms` }}
    >
      {/* Skeleton — shown until image loads */}
      {!loaded && !error && (
        <div className="absolute inset-0 z-10 bg-white rounded-xl border border-gray-100 overflow-hidden animate-pulse">
          <div className="aspect-square bg-gradient-to-br from-slate-100 to-blue-50" />
          <div className="p-4 space-y-3">
            <div className="h-4 bg-gray-200 rounded-lg w-3/4" />
            <div className="h-3 bg-gray-100 rounded-lg w-1/2" />
            <div className="h-3 bg-blue-50 rounded-lg w-1/3" />
          </div>
        </div>
      )}
      {/* Real card — fades in when image ready */}
      <Link
        to={`/products/${product.id}`}
        className={`group bg-white rounded-xl border border-gray-200 hover:border-blue-400 transition-all duration-300 hover:shadow-xl overflow-hidden block ${loaded || error ? 'opacity-100' : 'opacity-0'}`}
        style={{ transition: 'opacity 0.3s ease' }}
      >
        <div className="relative bg-gray-50 aspect-square flex items-center justify-center p-6 overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
            loading={idx < 8 ? 'eager' : 'lazy'}
            fetchpriority={idx < 4 ? 'high' : undefined}
            onLoad={() => setLoaded(true)}
            onError={() => { setError(true); setLoaded(true); }}
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
    </div>
  );
}

function Products() {
  const [searchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState(() => searchParams.get('category') || 'all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterKey, setFilterKey] = useState(0);
  const [mounted, setMounted] = useState(true);
  const { categories, products } = getProductsData();

  const activeCat = categories.find(c => c.id === selectedCategory);
  useSEO({
    title: activeCat
      ? `${activeCat.name} | GK2 Switchgear Products`
      : 'All Products | MCB, Busbar, Fuse & Switchgear | GK2',
    description: activeCat
      ? `${activeCat.description} — GK2 Switchgear, IS/IEC certified manufacturer, Gujarat, India.`
      : 'Browse GK2 Switchgear products — MCBs, busbars, HRC fuses, switch disconnector fuses, changeover switches. IS/IEC certified. Made in India.',
    canonical: selectedCategory !== 'all' ? `/products?category=${selectedCategory}` : '/products',
  });

  // Sync if URL param changes (e.g. navigating from home)
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setSelectedCategory(cat);
  }, [searchParams]);

  const filteredProducts = useMemo(() => {
    let result = selectedCategory === 'all' ? products : products.filter(p => p.category === selectedCategory);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.name?.toLowerCase().includes(q) ||
        p.series?.toLowerCase().includes(q)
      );
    }
    return result;
  }, [selectedCategory, searchQuery, products]);

  // Bump key whenever filter changes to re-trigger animation
  const isFirst = useRef(true);
  useEffect(() => {
    if (isFirst.current) { isFirst.current = false; return; }
    setFilterKey(k => k + 1);
  }, [selectedCategory, searchQuery]);

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
      <style>{STYLE}</style>
      <DynamicBanner page="products" compact />

      <section className="bg-white border-b shadow-sm hidden sm:block sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3 flex items-center gap-3">
          {/* Category pills — scrollable */}
          <div className="flex-1 flex flex-wrap gap-2">
            {allCategories.map(cat => (
              <button
                key={cat.id}
                onClick={() => { setSelectedCategory(cat.id); scrollToTop(); }}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 border whitespace-nowrap ${
                  selectedCategory === cat.id
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-blue-400 hover:text-blue-600'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
          {/* Search — pinned right */}
          <div className="relative shrink-0 w-48">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="w-full pl-9 pr-7 py-1.5 rounded-full border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} aria-label="Clear search" className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs">✕</button>
            )}
          </div>
        </div>
      </section>

      {/* ── MOBILE: sticky filter bar ── */}
      <div className="sm:hidden sticky top-0 z-40 bg-white border-b shadow-sm px-4 py-3 space-y-2">
        <div className="flex items-center justify-between gap-3">
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
        {/* Mobile search input */}
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-9 pr-8 py-2 rounded-full border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} aria-label="Clear search" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs">✕</button>
          )}
        </div>
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
              <button onClick={() => setFilterOpen(false)} aria-label="Close filter" className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500">✕</button>
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

          <div key={filterKey} className="flex flex-wrap justify-center gap-6">
            {!mounted
              ? Array.from({ length: 8 }).map((_, i) => <ProductSkeleton key={i} />)
              : filteredProducts.map((product, idx) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    idx={idx}
                    getCategoryName={getCategoryName}
                    animDelay={Math.min(idx * 40, 300)}
                  />
                ))
            }
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-16">
              <div className="text-gray-400 text-6xl mb-4">📦</div>
              <h3 className="text-2xl font-semibold text-gray-700 mb-2">No Products Found</h3>
              <p className="text-gray-600">{searchQuery ? `No results for "${searchQuery}"` : 'Try selecting a different category'}</p>
            </div>
          )}
        </div>
      </section>

      {/* Bulk Quote CTA */}
      <section className="py-10 sm:py-14 bg-white border-t border-gray-100">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="bg-gradient-to-br from-[#0f172a] to-[#1e3a8a] rounded-2xl p-7 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white mb-1">Need a Bulk Quote?</h2>
              <p className="text-blue-300 text-sm sm:text-base">Get pricing for large orders of MCBs, busbars, HRC fuses & more. Fast response guaranteed.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 bg-white text-blue-800 px-6 py-3 rounded-xl font-bold text-sm hover:bg-blue-50 transition-colors shadow-lg whitespace-nowrap"
              >
                Get Quote →
              </Link>
              <a
                href="https://wa.me/918460645021?text=Hello%20GK2%2C%20I%20need%20a%20bulk%20quote%20for%20your%20products."
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bc5a] text-white px-6 py-3 rounded-xl font-bold text-sm transition-colors shadow-lg whitespace-nowrap"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 flex-shrink-0">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.528 5.855L.057 23.882a.5.5 0 0 0 .61.61l6.086-1.461A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 0 1-5.006-1.371l-.36-.214-3.724.894.924-3.638-.235-.374A9.818 9.818 0 1 1 12 21.818z"/>
                </svg>
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Products;
