import { useState } from 'react';
import productsData from '../../data/products.json';

export default function CategoryPreview() {
  const [search, setSearch] = useState('');
  const categories = productsData.categories || [];
  const products = productsData.products || [];

  const filtered = categories.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900">Categories</h1>
        <p className="text-gray-500 text-sm mt-1">{categories.length} product categories</p>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 mb-6 max-w-sm border border-gray-200 rounded-xl bg-white px-3 py-2.5 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-gray-400 shrink-0">
          <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
        </svg>
        <input
          type="text"
          placeholder="Search categories..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 text-sm bg-transparent text-gray-700 placeholder-gray-400"
          style={{ outline: 'none', border: 'none', boxShadow: 'none' }}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map(cat => {
          const catProducts = products.filter(p => p.category === cat.id);
          const sampleProduct = catProducts[0];
          return (
            <div key={cat.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                {/* Sample product image */}
                <div className="w-14 h-14 rounded-xl bg-gray-50 border border-gray-100 overflow-hidden shrink-0 flex items-center justify-center">
                  {sampleProduct?.image ? (
                    <img src={sampleProduct.image} alt={cat.name} className="w-full h-full object-contain p-1" onError={e => { e.target.style.display='none'; }} />
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6 text-gray-300">
                      <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
                    </svg>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-gray-900 text-sm">{cat.name}</h3>
                    <span className="text-xs bg-blue-50 text-blue-600 w-5 h-5 inline-flex items-center justify-center rounded-full font-bold shrink-0">{catProducts.length}</span>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{cat.description}</p>
                  <code className="text-xs text-gray-400 mt-1.5 block font-mono">{cat.id}</code>
                </div>
              </div>

              {/* Product thumbnails */}
              {catProducts.length > 0 && (
                <div className="mt-4 flex gap-1.5 flex-wrap">
                  {catProducts.slice(0, 5).map(p => (
                    <div key={p.id} className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 overflow-hidden">
                      <img src={p.image} alt={p.name} className="w-full h-full object-contain p-0.5" onError={e => { e.target.style.display='none'; }} />
                    </div>
                  ))}
                  {catProducts.length > 5 && (
                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-xs text-gray-500 font-semibold">
                      +{catProducts.length - 5}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
