import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import bannersData from '../data/banners.json';
import logo from '../assets/logo.png';

function DynamicBanner({ page = 'home' }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Filter banners for current page and only active ones
  const activeBanners = bannersData.banners
    .filter(banner => banner.isActive && banner.showOn.includes(page))
    .sort((a, b) => a.order - b.order);

  // Auto-advance slider
  useEffect(() => {
    if (activeBanners.length <= 1) return;
    
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % activeBanners.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(timer);
  }, [activeBanners.length]);

  if (activeBanners.length === 0) {
    return null; // Don't show banner if no active banners
  }

  return (
    <section className="relative text-white min-h-screen flex items-center overflow-hidden">
      {/* Background Slides */}
      {activeBanners.map((banner, index) => (
        <div
          key={banner.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Background Image */}
          {banner.image && (
            <div className="absolute inset-0">
              <img
                src={banner.image}
                alt={banner.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          {/* Gradient Overlay */}
          <div className={`absolute inset-0 bg-gradient-to-br ${banner.backgroundColor} opacity-85`}></div>
          
          {/* Animated Circuit Pattern Overlay */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `
                linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px),
                linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px'
            }}></div>
          </div>
        </div>
      ))}

      {/* Slider Indicators */}
      {activeBanners.length > 1 && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex gap-2">
          {activeBanners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? 'bg-white w-8' 
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {activeBanners[currentSlide].title && (
            <div className="inline-block mb-6 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
              <span className="text-white text-sm font-medium">
                {activeBanners[currentSlide].title}
              </span>
            </div>
          )}
          
          <div className="mb-6 flex justify-center">
            <img 
              src={logo} 
              alt="GK2 Logo" 
              className="h-24 sm:h-28 md:h-32 w-auto"
              style={{
                filter: 'brightness(0) invert(1) drop-shadow(0 0 20px rgba(59, 130, 246, 0.8))'
              }}
            />
          </div>
          
          {activeBanners[currentSlide].subtitle && (
            <p className="text-xl sm:text-2xl md:text-3xl mb-4 text-blue-100 font-light">
              {activeBanners[currentSlide].subtitle}
            </p>
          )}
          
          {activeBanners[currentSlide].description && (
            <p className="text-base sm:text-lg mb-8 text-blue-200 max-w-3xl mx-auto leading-relaxed">
              {activeBanners[currentSlide].description}
            </p>
          )}
          
          {activeBanners[currentSlide].buttonText && activeBanners[currentSlide].buttonLink && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to={activeBanners[currentSlide].buttonLink}
                className="group relative bg-white text-blue-900 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
              >
                <span className="relative z-10">{activeBanners[currentSlide].buttonText}</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 rounded-lg opacity-0 group-hover:opacity-10 transition-opacity"></div>
              </Link>
              <Link
                to="/contact"
                className="group bg-transparent text-white px-8 py-3 rounded-lg font-semibold border-2 border-blue-400 hover:bg-blue-400/10 transition-all duration-300 hover:scale-105"
              >
                Get in Touch
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="rgb(249, 250, 251)"/>
        </svg>
      </div>
    </section>
  );
}

export default DynamicBanner;
