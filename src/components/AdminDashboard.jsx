import { useState } from 'react';
import AdminSidebar from './AdminSidebar';
import BannerPreview from './admin/BannerPreview';
import CategoryPreview from './admin/CategoryPreview';
import ProductPreview from './admin/ProductPreview';
import DistributorPreview from './admin/DistributorPreview';
import AdminOverview from './admin/AdminOverview';

function AdminDashboard({ onLogout }) {
  const [activeSection, setActiveSection] = useState('overview');

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':    return <AdminOverview setActiveSection={setActiveSection} />;
      case 'banners':     return <BannerPreview />;
      case 'categories':  return <CategoryPreview />;
      case 'products':    return <ProductPreview />;
      case 'distributors':return <DistributorPreview />;
      default:            return <AdminOverview setActiveSection={setActiveSection} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        onLogout={onLogout}
      />
      <div className="flex-1 overflow-auto">
        <div className="p-8 min-h-full">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
