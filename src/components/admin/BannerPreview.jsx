import { useState } from 'react';
import bannersData from '../../data/banners.json';

const PAGE_LABELS = {
  home: 'Home',
  products: 'Products',
  about: 'About',
  distributors: 'Distributors',
  contact: 'Contact',
};

export default function BannerPreview() {
  const [filter, setFilter] = useState('home');
  const allBanners = bannersData.banners || [];

  const pages = ['home', 'products', 'about', 'distributors', 'contact'];
  const filtered = allBanners.filter(b => b.showOn?.includes(filter));
  const countFor = (page) => allBanners.filter(b => b.showOn?.includes(page)).length;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900">Banners</h1>
        <p className="text-gray-500 text-sm mt-1">
          {allBanners.length} total — each page has its own banner set
        </p>
      </div>

      {/* Page tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {pages.map(p => (
          <button
            key={p}
            onClick={() => setFilter(p)}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              filter === p
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white border border-gray-200 text-gray-600 hover:border-blue-300'
            }`}
          >
            {PAGE_LABELS[p]}
            <span className={`text-xs w-5 h-5 inline-flex items-center justify-center rounded-full font-bold shrink-0 ${
              filter === p ? 'bg-white/25 text-white' : 'bg-gray-100 text-gray-500'
            }`}>
              {countFor(p)}
            </span>
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-gray-400 text-sm">No banners for this page</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide w-16">Order</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide w-20">Image</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Title / Subtitle</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Button</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Video</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(banner => (
                <tr key={banner.id} className="hover:bg-gray-50 transition-colors">
                  {/* Order */}
                  <td className="px-4 py-3">
                    <span className="text-xs font-bold text-gray-400">#{banner.order}</span>
                  </td>

                  {/* Thumbnail */}
                  <td className="px-4 py-3">
                    <div className="w-16 h-10 rounded-lg overflow-hidden bg-gradient-to-br from-blue-900 to-blue-950 flex items-center justify-center shrink-0">
                      {banner.image ? (
                        <img
                          src={banner.image}
                          alt={banner.title}
                          className="w-full h-full object-cover opacity-80"
                          onError={e => { e.target.style.display = 'none'; }}
                        />
                      ) : (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5 text-blue-600">
                          <rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/>
                        </svg>
                      )}
                    </div>
                  </td>

                  {/* Title */}
                  <td className="px-4 py-3">
                    <div className="font-semibold text-gray-900">{banner.title}</div>
                    {banner.subtitle && (
                      <div className="text-xs text-gray-400 mt-0.5">{banner.subtitle}</div>
                    )}
                  </td>

                  {/* Button */}
                  <td className="px-4 py-3">
                    <div className="text-xs font-medium text-gray-700">{banner.buttonText}</div>
                    <div className="text-xs text-gray-400 font-mono mt-0.5">{banner.buttonLink}</div>
                  </td>

                  {/* Video */}
                  <td className="px-4 py-3">
                    {banner.video ? (
                      <span className="text-xs bg-violet-100 text-violet-600 px-2 py-0.5 rounded-full font-medium">Yes</span>
                    ) : (
                      <span className="text-xs text-gray-300">—</span>
                    )}
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3 text-center">
                    <span className={`text-xs font-semibold px-4 py-1 rounded-full ${
                      banner.isActive !== false
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-500'
                    }`}>
                      {banner.isActive !== false ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <div className="px-4 py-3 border-t border-gray-50 text-xs text-gray-400">
          Showing {filtered.length} banner{filtered.length !== 1 ? 's' : ''} for {PAGE_LABELS[filter]} page
        </div>
      </div>
    </div>
  );
}
