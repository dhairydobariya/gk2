import productsData from '../../data/products.json';
import bannersData from '../../data/banners.json';
import distributorsData from '../../data/distributors.json';

const StatCard = ({ label, value, sub, color, icon, onClick }) => (
  <button
    onClick={onClick}
    className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 text-left w-full"
  >
    <div className="flex items-start justify-between mb-4">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${color}`}>
        {icon}
      </div>
    </div>
    <div className="text-3xl font-black text-gray-900 mb-1">{value}</div>
    <div className="text-sm font-semibold text-gray-700">{label}</div>
    {sub && <div className="text-xs text-gray-400 mt-0.5">{sub}</div>}
  </button>
);

export default function AdminOverview({ setActiveSection }) {
  const products = productsData.products || [];
  const categories = productsData.categories || [];
  const banners = bannersData.banners || [];
  const distributors = distributorsData.distributors || [];

  const activeBanners = banners.filter(b => b.isActive !== false).length;
  const featuredProducts = products.filter(p => p.featured).length;
  const homeBanners = banners.filter(b => b.showOn?.includes('home')).length;

  // Recent products (last 5)
  const recentProducts = products.slice(-5).reverse();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-black text-gray-900">Overview</h1>
        <p className="text-gray-500 text-sm mt-1">GK2 Switchgear — static data summary</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Total Products"
          value={products.length}
          sub={`${featuredProducts} featured`}
          color="bg-blue-50 text-blue-600"
          onClick={() => setActiveSection('products')}
          icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/></svg>}
        />
        <StatCard
          label="Categories"
          value={categories.length}
          sub="product categories"
          color="bg-violet-50 text-violet-600"
          onClick={() => setActiveSection('categories')}
          icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="M4 6h16M4 12h16M4 18h7"/></svg>}
        />
        <StatCard
          label="Banners"
          value={banners.length}
          sub={`${activeBanners} active · ${homeBanners} on home`}
          color="bg-amber-50 text-amber-600"
          onClick={() => setActiveSection('banners')}
          icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>}
        />
        <StatCard
          label="Distributors"
          value={distributors.length}
          sub="authorized partners"
          color="bg-emerald-50 text-emerald-600"
          onClick={() => setActiveSection('distributors')}
          icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Products */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
            <h2 className="font-bold text-gray-900">Products</h2>
            <button onClick={() => setActiveSection('products')} className="text-xs text-blue-600 hover:text-blue-700 font-medium">View all →</button>
          </div>
          <div className="divide-y divide-gray-50">
            {recentProducts.map(p => (
              <div key={p.id} className="px-6 py-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gray-50 overflow-hidden shrink-0">
                  <img src={p.image} alt={p.name} className="w-full h-full object-contain" onError={e => e.target.style.display='none'} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-gray-800 truncate">{p.name}</div>
                  <div className="text-xs text-gray-400">{p.variants?.length || 0} variants · {p.series}</div>
                </div>
                {p.featured && <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium shrink-0">Featured</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Categories breakdown */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
            <h2 className="font-bold text-gray-900">Categories</h2>
            <button onClick={() => setActiveSection('categories')} className="text-xs text-blue-600 hover:text-blue-700 font-medium">View all →</button>
          </div>
          <div className="divide-y divide-gray-50">
            {categories.map(cat => {
              const count = products.filter(p => p.category === cat.id).length;
              return (
                <div key={cat.id} className="px-6 py-3 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold text-gray-800">{cat.name}</div>
                    <div className="text-xs text-gray-400 truncate max-w-xs">{cat.description}</div>
                  </div>
                  <span className="text-xs bg-blue-50 text-blue-700 px-4 py-1 rounded-full font-semibold shrink-0 ml-3">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
