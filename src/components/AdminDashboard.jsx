import { useState } from 'react';
import AdminSidebar from './AdminSidebar';
import BannerPreview from './admin/BannerPreview';
import CategoryPreview from './admin/CategoryPreview';
import ProductPreview from './admin/ProductPreview';
import DistributorPreview from './admin/DistributorPreview';
import AdminOverview from './admin/AdminOverview';

const SECTION_LABELS = {
  overview: 'Overview',
  banners: 'Banners',
  categories: 'Categories',
  products: 'Products',
  distributors: 'Distributors',
};

function AdminDashboard({ onLogout }) {
  const [activeSection, setActiveSection] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':     return <AdminOverview setActiveSection={setActiveSection} />;
      case 'banners':      return <BannerPreview />;
      case 'categories':   return <CategoryPreview />;
      case 'products':     return <ProductPreview />;
      case 'distributors': return <DistributorPreview />;
      default:             return <AdminOverview setActiveSection={setActiveSection} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <AdminSidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        onLogout={onLogout}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile top bar */}
        <div className="lg:hidden flex items-center gap-3 px-4 py-3 bg-white border-b border-gray-100 shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
              <path d="M3 12h18M3 6h18M3 18h18"/>
            </svg>
          </button>
          <span className="font-semibold text-gray-800 text-sm">{SECTION_LABELS[activeSection]}</span>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4 lg:p-8">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
