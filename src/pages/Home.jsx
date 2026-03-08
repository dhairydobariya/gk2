import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import DynamicBanner from '../components/DynamicBanner';
import logo from '../assets/logo.png';

function Home() {
  const [statsVisible, setStatsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const statsSection = document.getElementById('stats-section');
      if (statsSection) {
        const rect = statsSection.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom >= 0) {
          setStatsVisible(true);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check on mount
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const stats = [
    { value: 25, label: 'Years Experience', suffix: '+' },
    { value: 500, label: 'Products', suffix: '+' },
    { value: 15, label: 'Industries Served', suffix: '+' },
    { value: 99, label: 'Quality Standard', suffix: '%' }
  ];

  const productCategories = [
    {
      title: 'Single & Double Pole MCB',
      description: 'C Series 10KA breaking capacity for residential and commercial use',
      icon: '⚡',
      specs: '6A - 63A'
    },
    {
      title: 'Triple & Four Pole MCB',
      description: 'C Series 10KA for three-phase industrial applications',
      icon: '🔌',
      specs: '6A - 63A'
    },
    {
      title: 'Modular MCB',
      description: 'Compact design for space-saving installations',
      icon: '📦',
      specs: '6A - 32A'
    },
    {
      title: 'Tiny MCB',
      description: 'Ultra-compact for space-constrained areas',
      icon: '🔷',
      specs: '6A - 32A'
    }
  ];

  const industries = [
    { name: 'Industrial', icon: '🏭' },
    { name: 'Commercial', icon: '🏢' },
    { name: 'Residential', icon: '🏠' },
    { name: 'Infrastructure', icon: '🌉' },
    { name: 'Manufacturing', icon: '⚙️' },
    { name: 'Energy', icon: '⚡' }
  ];

  return (
    <div className="min-h-screen">
      {/* Dynamic Banner Section */}
      <DynamicBanner page="home" />

      {/* Trust Bar / Stats Counter */}
      <section id="stats-section" className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200">
                  <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">
                    {statsVisible ? (
                      <span className="inline-block animate-pulse">
                        {stat.value}{stat.suffix}
                      </span>
                    ) : (
                      <span>0{stat.suffix}</span>
                    )}
                  </div>
                  <div className="text-sm md:text-base text-gray-600 font-medium">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Categories Preview */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Our Product Range
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Comprehensive MCB solutions for every electrical protection need
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto mb-10">
            {productCategories.map((category, index) => (
              <div
                key={index}
                className="group relative bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl border-2 border-gray-200 hover:border-blue-400 transition-all duration-300 hover:shadow-xl hover:-translate-y-2"
              >
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400/0 to-blue-600/0 group-hover:from-blue-400/5 group-hover:to-blue-600/5 rounded-xl transition-all duration-300"></div>
                
                <div className="relative z-10">
                  <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                    {category.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {category.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                    {category.description}
                  </p>
                  <div className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                    {category.specs}
                  </div>
                </div>

                {/* Circuit Corner Decoration */}
                <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-blue-200 group-hover:border-blue-400 transition-colors"></div>
                <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-blue-200 group-hover:border-blue-400 transition-colors"></div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
            >
              View All Products
              <span className="text-xl">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 sm:py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
              <span>Why Choose</span>
              <img 
                src={logo} 
                alt="GK2 Logo" 
                className="h-10 sm:h-12 w-auto"
              />
              <span>?</span>
            </h2>
            <p className="text-lg text-gray-600">
              Excellence in every aspect of electrical protection
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="group relative bg-white p-8 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-blue-300">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-blue-600 rounded-t-2xl transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
              
              <div className="text-6xl mb-6 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">⚡</div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900 group-hover:text-blue-600 transition-colors">
                Superior Quality
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Premium MCBs with superior breaking capacity and reliability for all electrical installations
              </p>
            </div>

            <div className="group relative bg-white p-8 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-blue-300">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-blue-600 rounded-t-2xl transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
              
              <div className="text-6xl mb-6 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">🔧</div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900 group-hover:text-blue-600 transition-colors">
                Wide Range
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Diverse MCB variants with different ratings and configurations for every protection need
              </p>
            </div>

            <div className="group relative bg-white p-8 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-blue-300">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-blue-600 rounded-t-2xl transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
              
              <div className="text-6xl mb-6 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">✓</div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900 group-hover:text-blue-600 transition-colors">
                Trusted Expertise
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Years of experience with commitment to safety, quality, and customer satisfaction
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Industries We Serve */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Industries We Power
            </h2>
            <p className="text-lg text-gray-600">
              Trusted electrical protection across diverse sectors
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 max-w-6xl mx-auto">
            {industries.map((industry, index) => (
              <div
                key={index}
                className="group flex flex-col items-center p-6 bg-gradient-to-br from-blue-50 to-white rounded-xl border-2 border-blue-100 hover:border-blue-400 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              >
                <div className="text-5xl mb-3 transform group-hover:scale-125 transition-transform duration-300">
                  {industry.icon}
                </div>
                <div className="text-sm font-semibold text-gray-700 group-hover:text-blue-600 transition-colors text-center">
                  {industry.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology & Certifications */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-gray-900 to-blue-900 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left: Key Features */}
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                  Advanced Technology
                </h2>
                <p className="text-blue-100 mb-8 text-lg">
                  Engineered for excellence with cutting-edge electrical protection technology
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 hover:bg-white/10 transition-all">
                    <div className="text-2xl">⚡</div>
                    <div>
                      <h3 className="font-bold text-lg mb-1">10KA Breaking Capacity</h3>
                      <p className="text-blue-200 text-sm">Superior protection for high-fault current scenarios</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4 p-4 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 hover:bg-white/10 transition-all">
                    <div className="text-2xl">🔒</div>
                    <div>
                      <h3 className="font-bold text-lg mb-1">Safety Standards</h3>
                      <p className="text-blue-200 text-sm">Compliant with international electrical safety norms</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4 p-4 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 hover:bg-white/10 transition-all">
                    <div className="text-2xl">✓</div>
                    <div>
                      <h3 className="font-bold text-lg mb-1">Quality Assurance</h3>
                      <p className="text-blue-200 text-sm">Rigorous testing and quality control processes</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Certifications */}
              <div>
                <h3 className="text-2xl font-bold mb-6">Certifications & Standards</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20 hover:bg-white/15 transition-all text-center">
                    <div className="text-4xl mb-2">🏆</div>
                    <div className="font-bold">ISO Certified</div>
                    <div className="text-sm text-blue-200">Quality Management</div>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20 hover:bg-white/15 transition-all text-center">
                    <div className="text-4xl mb-2">✓</div>
                    <div className="font-bold">IEC Standards</div>
                    <div className="text-sm text-blue-200">International Compliance</div>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20 hover:bg-white/15 transition-all text-center">
                    <div className="text-4xl mb-2">🔒</div>
                    <div className="font-bold">Safety Tested</div>
                    <div className="text-sm text-blue-200">Rigorous Validation</div>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20 hover:bg-white/15 transition-all text-center">
                    <div className="text-4xl mb-2">⚡</div>
                    <div className="font-bold">CE Marked</div>
                    <div className="text-sm text-blue-200">European Standards</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative py-20 bg-gradient-to-r from-blue-600 to-blue-800 text-white overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
              linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
              Ready to Protect Your Electrical Systems?
            </h2>
            <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
              Get in touch with our team to find the perfect MCB solution for your needs
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/products"
                className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
              >
                Browse Products
              </Link>
              <Link
                to="/contact"
                className="bg-transparent text-white px-8 py-4 rounded-lg font-semibold border-2 border-white hover:bg-white/10 transition-all duration-300 hover:scale-105"
              >
                Contact Us Today
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
