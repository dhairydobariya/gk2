import { useState } from 'react';
import distributorsData from '../../data/distributors.json';

export default function DistributorPreview() {
  const [search, setSearch] = useState('');
  const distributors = distributorsData.distributors || [];

  const filtered = distributors.filter(d => {
    const q = search.toLowerCase();
    return !q || d.name.toLowerCase().includes(q) || d.city.toLowerCase().includes(q) || d.state.toLowerCase().includes(q);
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900">Distributors</h1>
        <p className="text-gray-500 text-sm mt-1">{distributors.length} authorized partners</p>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 mb-6 max-w-sm border border-gray-200 rounded-xl bg-white px-3 py-2.5 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-gray-400 shrink-0">
          <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
        </svg>
        <input
          type="text"
          placeholder="Search by name or city..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 text-sm bg-transparent text-gray-700 placeholder-gray-400"
          style={{ outline: 'none', border: 'none', boxShadow: 'none' }}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.map(d => (
          <div key={d.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            {/* Store image */}
            <div className="h-32 bg-gradient-to-br from-slate-100 to-slate-200 relative overflow-hidden">
              {d.image && d.image !== '/placeholder.png' ? (
                <img src={d.image} alt={d.name} className="w-full h-full object-cover" onError={e => { e.target.style.display='none'; }} />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-10 h-10 text-slate-300">
                    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
                  </svg>
                </div>
              )}
              {/* Logo overlay */}
              {d.logo && d.logo !== '/placeholder.png' && (
                <div className="absolute bottom-3 left-3 w-10 h-10 bg-white rounded-lg shadow-md overflow-hidden">
                  <img src={d.logo} alt="logo" className="w-full h-full object-contain p-1" onError={e => { e.target.style.display='none'; }} />
                </div>
              )}
            </div>

            <div className="p-4">
              <h3 className="font-bold text-gray-900 mb-0.5">{d.name}</h3>
              <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-3">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5 shrink-0">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
                </svg>
                {d.city}, {d.state} — {d.pincode}
              </div>

              <div className="space-y-1.5 text-xs text-gray-600">
                <div className="flex items-center gap-2">
                  <span className="text-gray-400 w-16 shrink-0">Contact</span>
                  <span className="font-medium">{d.contactPerson}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400 w-16 shrink-0">Phone</span>
                  <span>{d.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400 w-16 shrink-0">Email</span>
                  <span className="truncate">{d.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400 w-16 shrink-0">Since</span>
                  <span>{d.established}</span>
                </div>
              </div>

              {/* Coverage tags */}
              {d.coverage?.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1">
                  {d.coverage.map(area => (
                    <span key={area} className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium">{area}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
