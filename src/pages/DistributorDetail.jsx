import { useParams, Link } from 'react-router-dom';
import { getDistributors } from '../utils/dataManager';
import ImageWithFallback from '../components/ImageWithFallback';
import logo from '../assets/logo.png';

function DistributorDetail() {
  const { id } = useParams();
  const distributor = getDistributors().find(d => d.id === id);

  if (!distributor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Distributor Not Found</h2>
          <p className="text-gray-600 mb-6">The distributor you're looking for doesn't exist.</p>
          <Link to="/distributors" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
            Back to Distributors
          </Link>
        </div>
      </div>
    );
  }

  const mapAddress = `${distributor.address}, ${distributor.city}, ${distributor.state} ${distributor.pincode}`;
  const mapSearchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapAddress)}`;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm">
            <Link to="/" className="text-blue-600 hover:text-blue-800">Home</Link>
            <span className="text-gray-400">/</span>
            <Link to="/distributors" className="text-blue-600 hover:text-blue-800">Distributors</Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-600">{distributor.name}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Store Image */}
            {distributor.image && distributor.image !== '/placeholder.png' && (
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <ImageWithFallback src={distributor.image} alt={distributor.name} className="w-full h-64 object-cover" />
              </div>
            )}

            {/* Info Card */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-start gap-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-3">
                  <ImageWithFallback
                    src={distributor.logo}
                    alt={`${distributor.name} logo`}
                    className="h-16 w-auto object-contain"
                    fallbackSrc={logo}
                  />
                </div>
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{distributor.name}</h1>
                  {distributor.established && (
                    <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
                      Established {distributor.established}
                    </span>
                  )}
                </div>
              </div>

              <div className="border-t pt-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Contact Information</h2>
                <div className="space-y-3">
                  {distributor.contactPerson && (
                    <div className="flex items-start gap-3">
                      <span className="text-blue-600 text-xl mt-0.5">👤</span>
                      <div>
                        <div className="text-sm text-gray-600">Contact Person</div>
                        <div className="font-medium text-gray-900">{distributor.contactPerson}</div>
                      </div>
                    </div>
                  )}
                  <div className="flex items-start gap-3">
                    <span className="text-blue-600 text-xl mt-0.5">📧</span>
                    <div>
                      <div className="text-sm text-gray-600">Email</div>
                      <a href={`mailto:${distributor.email}`} className="font-medium text-blue-600 hover:text-blue-800">{distributor.email}</a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-blue-600 text-xl mt-0.5">📞</span>
                    <div>
                      <div className="text-sm text-gray-600">Phone</div>
                      <a href={`tel:${distributor.phone}`} className="font-medium text-blue-600 hover:text-blue-800">{distributor.phone}</a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-blue-600 text-xl mt-0.5">📍</span>
                    <div>
                      <div className="text-sm text-gray-600">Address</div>
                      <div className="font-medium text-gray-900">
                        {distributor.address}<br />
                        {distributor.city}, {distributor.state} - {distributor.pincode}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {distributor.coverage && distributor.coverage.length > 0 && (
                <div className="border-t pt-6 mt-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Coverage Areas</h2>
                  <div className="flex flex-wrap gap-2">
                    {distributor.coverage.map((area, index) => (
                      <span key={index} className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium">{area}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Map */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6 border-b">
                <h2 className="text-xl font-bold text-gray-900">Location</h2>
              </div>
              <div className="relative h-96">
                <iframe
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(mapAddress)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Distributor Location"
                ></iframe>
              </div>
              <div className="p-4 bg-gray-50">
                <a href={mapSearchUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-2">
                  <span>📍</span> Open in Google Maps
                </a>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-4">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <a href={`mailto:${distributor.email}`} className="block w-full bg-blue-600 text-white text-center px-4 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                  📧 Send Email
                </a>
                <a href={`tel:${distributor.phone}`} className="block w-full bg-green-600 text-white text-center px-4 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors">
                  📞 Call Now
                </a>
                <a href={mapSearchUrl} target="_blank" rel="noopener noreferrer" className="block w-full bg-gray-600 text-white text-center px-4 py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors">
                  📍 Get Directions
                </a>
                <Link to="/distributors" className="block w-full bg-gray-100 text-gray-700 text-center px-4 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors">
                  ← Back to List
                </Link>
              </div>
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Need Help?</h4>
                <p className="text-sm text-gray-600">Contact this distributor directly for product inquiries, pricing, and availability.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DistributorDetail;
