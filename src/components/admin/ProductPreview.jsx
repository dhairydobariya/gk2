import { useState } from 'react';
import productsData from '../../data/products.json';

export default function ProductPreview() {
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('all');
  const [selected, setSelected] = useState(null);

  const products = productsData.products || [];
  const categories = productsData.categories || [];

  const filtered = products.filter(p => {
    const matchCat = catFilter === 'all' || p.category === catFilter;
    const q = search.toLowerCase();
    const matchSearch = !q || p.name.toLowerCase().includes(q) || p.series?.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  const selectedProduct = selected ? products.find(p => p.id === selected) : null;

  return (
    <div className="flex gap-6">
      {/* List */}
      <div className="flex-1 min-w-0">
        <div className="mb-5">
          <h1 className="text-2xl font-black text-gray-900">Products</h1>
          <p className="text-gray-500 text-sm mt-1">{products.length} products total</p>
        </div>

        {/* Filters row */}
        <div className="flex gap-3 mb-4">
          <div className="flex items-center gap-2 border border-gray-200 rounded-lg bg-white px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 flex-1 max-w-xs">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-gray-400 shrink-0">
              <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
            </svg>
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="flex-1 text-sm bg-transparent text-gray-700 placeholder-gray-400"
              style={{ outline: 'none', border: 'none', boxShadow: 'none' }}
            />
          </div>
          <select
            value={catFilter}
            onChange={e => setCatFilter(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="all">All Categories</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          {(search || catFilter !== 'all') && (
            <button
              onClick={() => { setSearch(''); setCatFilter('all'); }}
              className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700 border border-gray-200 rounded-lg bg-white"
            >
              Clear
            </button>
          )}
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide w-12"></th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Product</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Category</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Series</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Variants</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Stock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-gray-400 text-sm">No products found</td>
                </tr>
              )}
              {filtered.map(p => (
                <tr
                  key={p.id}
                  onClick={() => setSelected(p.id === selected ? null : p.id)}
                  className={`cursor-pointer transition-colors ${
                    selected === p.id ? 'bg-blue-50' : 'hover:bg-gray-50'
                  }`}
                >
                  {/* Thumbnail */}
                  <td className="px-4 py-2.5">
                    <div className="w-9 h-9 rounded-lg bg-gray-100 overflow-hidden flex items-center justify-center shrink-0">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-full h-full object-contain p-0.5"
                        onError={e => { e.target.style.display = 'none'; }}
                      />
                    </div>
                  </td>
                  {/* Name */}
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900">{p.name}</span>
                      {p.featured && (
                        <span className="text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full font-semibold">★</span>
                      )}
                    </div>
                    <div className="text-xs text-gray-400 font-mono mt-0.5">{p.id}</div>
                  </td>
                  {/* Category */}
                  <td className="px-4 py-2.5">
                    <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-medium">{p.category}</span>
                  </td>
                  {/* Series */}
                  <td className="px-4 py-2.5 text-gray-600 text-xs">{p.series}</td>
                  {/* Variants */}
                  <td className="px-4 py-2.5 text-center">
                    <span className="text-xs font-semibold text-gray-700">{p.variants?.length || 0}</span>
                  </td>
                  {/* Stock */}
                  <td className="px-4 py-2.5 text-center">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                      p.inStock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
                    }`}>
                      {p.inStock ? 'In Stock' : 'Out'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="px-4 py-3 border-t border-gray-50 text-xs text-gray-400">
            Showing {filtered.length} of {products.length} products
          </div>
        </div>
      </div>

      {/* Detail panel */}
      {selectedProduct && (
        <div className="w-72 shrink-0">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm sticky top-0 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
              <h2 className="font-bold text-gray-900 text-sm">Detail</h2>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>

            <div className="h-44 bg-gray-50 flex items-center justify-center">
              <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-contain p-4" onError={e => { e.target.style.display='none'; }} />
            </div>

            <div className="p-4 space-y-4 max-h-[calc(100vh-320px)] overflow-y-auto">
              <div>
                <div className="flex gap-1.5 flex-wrap mb-1">
                  {selectedProduct.featured && <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-semibold">Featured</span>}
                  {selectedProduct.inStock && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">In Stock</span>}
                </div>
                <h3 className="font-bold text-gray-900 text-sm">{selectedProduct.name}</h3>
                <p className="text-xs text-gray-500 mt-0.5">{selectedProduct.series} · {selectedProduct.breakingCapacity}</p>
              </div>

              {selectedProduct.features?.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Features</p>
                  <ul className="space-y-1">
                    {selectedProduct.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-1.5 text-xs text-gray-600">
                        <span className="text-blue-400 shrink-0 mt-0.5">•</span>{f}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedProduct.variants?.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Variants</p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedProduct.variants.map((v, i) => (
                      <span key={i} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-lg font-medium">{v.name}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
