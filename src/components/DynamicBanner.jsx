import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getBanners } from '../utils/dataManager';
import logo from '../assets/logo.png';

// ── COMPACT BANNER (non-home pages) ──────────────────────────────────────────
function CompactBanner({ banner }) {
  return (
    <section className="relative text-white flex items-center overflow-hidden min-h-[260px] sm:min-h-[300px]">
      {banner.video ? (
        <video
          key={banner.video}
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay muted loop playsInline
          poster={banner.videoFallbackImage || banner.image || undefined}
        >
          <source src={banner.video} type="video/mp4" />
        </video>
      ) : banner.image ? (
        <img src={banner.image} alt={banner.title} className="absolute inset-0 w-full h-full object-cover" />
      ) : null}
      <div className={`absolute inset-0 bg-gradient-to-br ${banner.backgroundColor || 'from-blue-900 via-blue-800 to-blue-950'} opacity-90`} />
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: 'linear-gradient(90deg,rgba(255,255,255,0.05) 1px,transparent 1px),linear-gradient(rgba(255,255,255,0.05) 1px,transparent 1px)',
        backgroundSize: '50px 50px'
      }} />
      <div className="container mx-auto px-4 relative z-10 text-center py-12">
        <img src={logo} alt="GK2" className="h-12 sm:h-14 w-auto mx-auto mb-4"
          style={{ filter: 'brightness(0) invert(1) drop-shadow(0 0 12px rgba(59,130,246,0.7))' }} />
        {banner.title && <h1 className="text-2xl sm:text-3xl font-black text-white mb-2">{banner.title}</h1>}
        {banner.subtitle && <p className="text-blue-200 text-base sm:text-lg">{banner.subtitle}</p>}
      </div>
    </section>
  );
}

// ── HERO SLIDER (home page) ───────────────────────────────────────────────────
function HeroSlider({ banners }) {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const timerRef = useRef(null);
  const touchStartX = useRef(null);

  const goTo = (index) => {
    if (animating || index === current) return;
    setAnimating(true);
    setCurrent(index);
    setTimeout(() => setAnimating(false), 700);
  };

  const next = () => goTo((current + 1) % banners.length);
  const prev = () => goTo((current - 1 + banners.length) % banners.length);

  useEffect(() => {
    timerRef.current = setInterval(next, 5500);
    return () => clearInterval(timerRef.current);
  }, [current, banners.length]);

  const handleTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) diff > 0 ? next() : prev();
    touchStartX.current = null;
  };

  const b = banners[current];

  return (
    <section
      className="relative w-full overflow-hidden hero-slider-height"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <style>{`
        .hero-slider-height { height: 52vw; min-height: 320px; max-height: 680px; }
        @media (max-width: 640px) { .hero-slider-height { height: 70vw; min-height: 260px; max-height: 420px; } }
        @keyframes progress-bar { from { width: 0%; } to { width: 100%; } }
      `}</style>

      {/* Background slides */}
      {banners.map((banner, i) => (
        <div key={banner.id} className="absolute inset-0 transition-opacity duration-700"
          style={{ opacity: i === current ? 1 : 0, zIndex: i === current ? 1 : 0 }}>
          {/* Video background — used when banner.video is set */}
          {banner.video ? (
            <video
              key={banner.video}
              className="w-full h-full object-cover object-center"
              autoPlay
              muted
              loop
              playsInline
              poster={banner.videoFallbackImage || banner.image || undefined}
            >
              <source src={banner.video} type="video/mp4" />
              {/* Fallback to image if video can't play */}
              {banner.image && <img src={banner.image} alt={banner.title} className="w-full h-full object-cover object-center" />}
            </video>
          ) : banner.image ? (
            <img src={banner.image} alt={banner.title} className="w-full h-full object-cover object-center" />
          ) : (
            <div className="w-full h-full bg-blue-950" />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/75" />
          <div className={`absolute inset-0 bg-gradient-to-br ${banner.backgroundColor || 'from-blue-950/60 via-transparent to-blue-950/60'}`} />
        </div>
      ))}

      {/* Grid texture — desktop only */}
      <div className="absolute inset-0 z-10 pointer-events-none opacity-10 hidden sm:block"
        style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.04) 1px,transparent 1px)', backgroundSize: '60px 60px' }} />

      {/* Main content */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center px-5 sm:px-8 text-center text-white">
        {/* Logo */}
        <div className="mb-4 sm:mb-6"
          style={{ transition: 'opacity 0.6s ease, transform 0.6s ease', opacity: animating ? 0 : 1, transform: animating ? 'translateY(-10px)' : 'translateY(0)' }}>
          <img src={logo} alt="GK2"
            className="h-14 sm:h-20 md:h-24 w-auto mx-auto"
            style={{ filter: 'brightness(0) invert(1) drop-shadow(0 0 20px rgba(59,130,246,0.9))' }} />
        </div>

        {/* Slide text */}
        <div style={{ transition: 'opacity 0.5s ease 0.1s, transform 0.5s ease 0.1s', opacity: animating ? 0 : 1, transform: animating ? 'translateY(14px)' : 'translateY(0)' }}>
          {b.subtitle && (
            <p className="text-blue-300 font-semibold text-xs sm:text-sm tracking-widest uppercase mb-2 sm:mb-3">{b.subtitle}</p>
          )}
          {b.title && (
            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-tight mb-5 sm:mb-6 max-w-xs sm:max-w-2xl md:max-w-3xl mx-auto">
              {b.title}
            </h1>
          )}
          {b.buttonText && b.buttonLink && (
            <div className="flex flex-row gap-3 justify-center items-center flex-wrap">
              <Link to={b.buttonLink}
                className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold text-xs sm:text-sm transition-all duration-200 shadow-md">
                {b.buttonText} →
              </Link>
              <Link to="/contact"
                className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 border border-white/30 text-white px-4 py-2 rounded-lg font-semibold text-xs sm:text-sm backdrop-blur-sm transition-all duration-200">
                Contact Us
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Slide counter — desktop only */}
      <div className="absolute top-5 right-5 z-30 text-white/60 text-sm font-mono hidden sm:block">
        <span className="text-white font-bold">{String(current + 1).padStart(2, '0')}</span>
        <span className="mx-1">/</span>
        <span>{String(banners.length).padStart(2, '0')}</span>
      </div>

      {/* Dot indicators */}
      <div className="absolute bottom-5 sm:bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 sm:gap-3">
        {banners.map((_, i) => (
          <button key={i} onClick={() => goTo(i)}
            className={`rounded-full transition-all duration-300 ${i === current ? 'w-6 sm:w-8 h-2 sm:h-2.5 bg-white' : 'w-2 h-2 sm:w-2.5 sm:h-2.5 bg-white/40 hover:bg-white/70'}`}
            aria-label={`Slide ${i + 1}`} />
        ))}
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 z-30 h-0.5 bg-white/10">
        <div key={current} className="h-full bg-blue-400"
          style={{ animation: 'progress-bar 5.5s linear forwards' }} />
      </div>


    </section>
  );
}

// ── MAIN EXPORT ──────────────────────────────────────────────────────────────
function DynamicBanner({ page = 'home', compact = false }) {
  const activeBanners = getBanners()
    .filter(b => b.isActive && b.showOn?.includes(page))
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  if (activeBanners.length === 0) return null;

  // Home page always gets the full hero slider
  if (page === 'home') {
    return <HeroSlider banners={activeBanners} />;
  }

  // All other pages get the compact single banner
  return <CompactBanner banner={activeBanners[0]} />;
}

export default DynamicBanner;
