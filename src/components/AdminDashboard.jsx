import { useState } from 'react';
import AdminSidebar from './AdminSidebar';
import BannerManagement from './admin/BannerManagement';
import CategoryManagement from './admin/CategoryManagement';
import ProductManagement from './admin/ProductManagement';
import DistributorManagement from './admin/DistributorManagement';

function AdminDashboard({ onLogout }) {
  const [activeSection, setActiveSection] = useState('banners');

  const renderContent = () => {
    switch (activeSection) {
      case 'banners':
        return <BannerManagement />;
      case 'categories':
        return <CategoryManagement />;
      case 'products':
        return <ProductManagement />;
      case 'distributors':
        return <DistributorManagement />;
      default:
        return <BannerManagement />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar 
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        onLogout={onLogout}
      />
      
      <div className="flex-1 overflow-auto">
        <div className="p-6 min-h-full flex flex-col">
          <div className="flex-grow">
            {renderContent()}
          </div>
          
          {/* Simple footer line */}
          <div className="mt-8 pt-4 border-t border-gray-300 text-center text-sm text-gray-600">
            <p>&copy; {new Date().getFullYear()} GK2 (GelKrupa Electronics). All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
