import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getDistributors } from '../utils/dataManager';
import logo from '../assets/logo.png';
import ImageWithFallback from '../components/ImageWithFallback';
import DynamicBanner from '../components/DynamicBanner';

function Distributors() {
  const [distributors, setDistributors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredDistributors, setFilteredDistributors] = useState([]);

  useEffect(() => {
    loadData();
    
    // Listen for data updates
    const handleDataUpdate = (event) => {
      if (event.detail.key === 'distributors') {
        loadData();
      }
    };
    
    window.addEventListener('dataUpdated', handleDataUpdate);
    return () => window.removeEventListener('dataUpdated', handleDataUpdate);
  }, []);

  const loadData = async () => {
    const distributorsData = await getDistributors();
    setDistributors(distributorsData || []);
  };

  useEffect(() => {
    const filtered = distributors.filter(dist => 
      dist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dist.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dist.state.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredDistributors(filtered);
  }, [searchTerm, distributors]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Dynamic Banner Section */}
      <DynamicBanner page="distributors" />

      {/* Search Section */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <input
              type="text"
              placeholder="Search by name, city, or state..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-6 py-4 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:outline-none text-lg"
            />
          </div>
        </div>
      </section>

      {/* Distributors Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {filteredDistributors.length} Distributors Found
            </h2>
          </div>

          <div className="flex flex-wrap justify-center gap-6">
            {filteredDistributors.map((distributor) => (
              <div
                key={distributor.id}
                className="bg-white rounded-xl border border-gray-200 hover:border-blue-400 transition-all duration-300 hover:shadow-xl overflow-hidden w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] max-w-md"
              >
                {/* Logo Section - Bigger and More Attractive */}
                <div className="relative h-48 bg-gradient-to-br from-blue-50 via-white to-gray-50 flex items-center justify-center p-8 border-b-2 border-gray-100">
                  <div className="relative">
                    {/* Decorative background circle */}
                    <div className="absolute inset-0 bg-blue-100 rounded-full opacity-20 blur-2xl scale-150"></div>
                    
                    {/* Logo */}
                    <div className="relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                      <ImageWithFallback
                        src={distributor.logo}
                        alt={`${distributor.name} logo`}
                        className="h-24 w-auto max-w-[200px] object-contain"
                        fallbackSrc={logo}
                      />
                    </div>
                  </div>
                </div>

                {/* Distributor Info */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">
                    {distributor.name}
                  </h3>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-start gap-2 text-sm">
                      <span className="text-blue-600 mt-0.5">👤</span>
                      <div>
                        <div className="font-medium text-gray-900">{distributor.contactPerson}</div>
                      </div>
                    </div>

                    <div className="flex items-start gap-2 text-sm">
                      <span className="text-blue-600 mt-0.5">📧</span>
                      <a href={`mailto:${distributor.email}`} className="text-gray-700 hover:text-blue-600">
                        {distributor.email}
                      </a>
                    </div>

                    <div className="flex items-start gap-2 text-sm">
                      <span className="text-blue-600 mt-0.5">📞</span>
                      <a href={`tel:${distributor.phone}`} className="text-gray-700 hover:text-blue-600">
                        {distributor.phone}
                      </a>
                    </div>

                    <div className="flex items-start gap-2 text-sm">
                      <span className="text-blue-600 mt-0.5">📍</span>
                      <div className="text-gray-700">
                        {distributor.city}, {distributor.state}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4 justify-center">
                    <span className="text-xs bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full font-medium">
                      Est. {distributor.established}
                    </span>
                    {distributor.coverage.slice(0, 2).map((area, index) => (
                      <span key={index} className="text-xs bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full">
                        {area}
                      </span>
                    ))}
                    {distributor.coverage.length > 2 && (
                      <span className="text-xs bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full">
                        +{distributor.coverage.length - 2} more
                      </span>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Link
                      to={`/distributors/${distributor.id}`}
                      className="flex-1 bg-blue-600 text-white text-center px-4 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md"
                    >
                      View Details
                    </Link>
                    <a
                      href={`mailto:${distributor.email}`}
                      className="flex-1 bg-gray-100 text-gray-700 text-center px-4 py-2.5 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                    >
                      Contact
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredDistributors.length === 0 && (
            <div className="text-center py-16">
              <div className="text-gray-400 text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-semibold text-gray-700 mb-2">
                No Distributors Found
              </h3>
              <p className="text-gray-600">
                Try adjusting your search criteria
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default Distributors;
