import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductsData } from '../utils/dataManager';
import ImageWithFallback from '../components/ImageWithFallback';
import useSEO from '../hooks/useSEO';
import QuoteModal from '../components/QuoteModal';

// ── LIGHTBOX ──────────────────────────────────────────────────────────────────
function Lightbox({ images, startIndex, onClose }) {
  const [idx, setIdx] = useState(startIndex);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef(null);
  const imgRef = useRef(null);

  // pinch-to-zoom state
  const lastDist = useRef(null);

  const resetZoom = () => { setZoom(1); setPan({ x: 0, y: 0 }); };

  const goTo = (i) => { setIdx((i + images.length) % images.length); resetZoom(); };

  // keyboard
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') goTo(idx + 1);
      if (e.key === 'ArrowLeft') goTo(idx - 1);
    };
    window.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', handler); document.body.style.overflow = ''; };
  }, [idx]);

  // scroll-to-zoom (desktop)
  const onWheel = (e) => {
    e.preventDefault();
    setZoom(z => Math.min(4, Math.max(1, z - e.deltaY * 0.002)));
  };

  // mouse drag (desktop)
  const onMouseDown = (e) => {
    if (zoom <= 1) return;
    setDragging(true);
    dragStart.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
  };
  const onMouseMove = (e) => {
    if (!dragging) return;
    setPan({ x: e.clientX - dragStart.current.x, y: e.clientY - dragStart.current.y });
  };
  const onMouseUp = () => setDragging(false);

  // touch pinch-to-zoom + swipe
  const touchStart = useRef(null);
  const onTouchStart = (e) => {
    if (e.touches.length === 2) {
      lastDist.current = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
    } else {
      touchStart.current = e.touches[0].clientX;
    }
  };
  const onTouchMove = (e) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      if (lastDist.current) {
        setZoom(z => Math.min(4, Math.max(1, z * (dist / lastDist.current))));
      }
      lastDist.current = dist;
    }
  };
  const onTouchEnd = (e) => {
    lastDist.current = null;
    if (zoom > 1) return; // don't swipe when zoomed
    if (touchStart.current === null) return;
    const diff = touchStart.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) diff > 0 ? goTo(idx + 1) : goTo(idx - 1);
    touchStart.current = null;
  };

  return (
    <div className="fixed inset-0 z-[999] flex flex-col bg-black/95 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>

      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 shrink-0">
        <span className="text-white/50 text-sm font-mono">{idx + 1} / {images.length}</span>
        <div className="flex items-center gap-2">
          {/* Zoom controls */}
          <button onClick={() => setZoom(z => Math.min(4, z + 0.5))}
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-lg transition-colors" aria-label="Zoom in" title="Zoom in">+</button>
          <span className="text-white/60 text-xs w-10 text-center">{Math.round(zoom * 100)}%</span>
          <button onClick={() => { setZoom(z => Math.max(1, z - 0.5)); if (zoom <= 1.5) resetZoom(); }}
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-lg transition-colors" aria-label="Zoom out" title="Zoom out">−</button>
          <button onClick={resetZoom}
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors text-xs font-bold" aria-label="Reset zoom" title="Reset zoom">1:1</button>
          <div className="w-px h-5 bg-white/20 mx-1" />
          <button onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-red-500/80 text-white flex items-center justify-center transition-colors text-lg" aria-label="Close lightbox" title="Close">✕</button>
        </div>
      </div>

      {/* Image area */}
      <div className="flex-1 relative overflow-hidden flex items-center justify-center select-none"
        onWheel={onWheel}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        style={{ cursor: zoom > 1 ? (dragging ? 'grabbing' : 'grab') : 'zoom-in' }}
      >
        <img
          ref={imgRef}
          src={images[idx]}
          alt={`View ${idx + 1}`}
          style={{
            transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
            transition: dragging ? 'none' : 'transform 0.2s ease',
            maxWidth: '90vw',
            maxHeight: '80vh',
            objectFit: 'contain',
            userSelect: 'none',
            pointerEvents: 'none',
          }}
          draggable={false}
        />
        {/* Hint */}
        {zoom === 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/30 text-xs pointer-events-none hidden sm:block">
            Scroll to zoom · Drag to pan
          </div>
        )}
      </div>

      {/* Prev / Next */}
      {images.length > 1 && (
        <>
          <button onClick={() => goTo(idx - 1)} aria-label="Previous image"
            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center text-2xl transition-colors z-10">‹</button>
          <button onClick={() => goTo(idx + 1)} aria-label="Next image"
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center text-2xl transition-colors z-10">›</button>
        </>
      )}

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div className="shrink-0 flex justify-center gap-2 px-4 py-3 overflow-x-auto">
          {images.map((img, i) => (
            <button key={i} onClick={() => goTo(i)} aria-label={`View image ${i + 1}`}
              className={`w-14 h-14 rounded-lg overflow-hidden border-2 shrink-0 transition-all duration-200 ${i === idx ? 'border-blue-400 opacity-100' : 'border-white/20 opacity-50 hover:opacity-80'}`}>
              <img src={img} alt={`Thumbnail ${i + 1}`} className="w-full h-full object-contain bg-white/5" draggable={false} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ProductDetail() {
  const { id } = useParams();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [quoteOpen, setQuoteOpen] = useState(false);

  // hover zoom state
  const [hoverPos, setHoverPos] = useState(null); // { x, y } as 0–1 fractions
  const [panelTop, setPanelTop] = useState(0);    // fixed top position in px
  const [panelLeft, setPanelLeft] = useState(0);  // fixed left position in px
  const imgContainerRef = useRef(null);
  const ZOOM_FACTOR = 2.5;

  const handleMouseMove = (e) => {
    const rect = imgContainerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    const y = Math.min(1, Math.max(0, (e.clientY - rect.top) / rect.height));
    setHoverPos({ x, y });
    // Position panel to the right of the image, vertically centered on viewport
    setPanelLeft(rect.right + 51);
    setPanelTop(Math.max(16, rect.top + rect.height / 2 - 260));
  };
  const handleMouseLeave = () => setHoverPos(null);

  const { products } = getProductsData();
  const product = products.find(p => p.id === id);
  const relatedProducts = product
    ? products.filter(p => p.category === product.category && p.id !== id).slice(0, 4)
    : [];

  useSEO(product ? {
    title: `${product.name} | ${product.series} Series | GK2 Switchgear India`,
    description: `Buy ${product.name} from GK2 Switchgear — ${product.series} series, ${product.breakingCapacity !== '—' ? product.breakingCapacity + ' breaking capacity, ' : ''}${product.variants?.length || 0} variants available. IS/IEC certified switchgear manufacturer, Gujarat, India. Get a quote today.`,
    canonical: `/products/${product.id}`,
    schema: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Product',
          name: product.name,
          description: product.features?.join('. ') || product.name,
          image: `https://gk2switchgear.com${product.image}`,
          brand: { '@type': 'Brand', name: 'GK2 Switchgear' },
          manufacturer: { '@type': 'Organization', name: 'GK2 Switchgear' },
          offers: { '@type': 'Offer', availability: product.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock', priceCurrency: 'INR', seller: { '@type': 'Organization', name: 'GK2 Switchgear' } },
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://gk2switchgear.com/' },
            { '@type': 'ListItem', position: 2, name: 'Products', item: 'https://gk2switchgear.com/products' },
            { '@type': 'ListItem', position: 3, name: product.name, item: `https://gk2switchgear.com/products/${product.id}` },
          ],
        },
      ],
    }
  } : {});

  const images = product ? [product.image, product.image1, product.image2, product.image3].filter(Boolean) : [];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    setCurrentIndex(0);
    setQuantity(1);
    if (product?.variants?.length > 0) {
      setSelectedVariant(product.variants[0]);
    } else {
      setSelectedVariant(null);
    }
  }, [id]);

  const handleQuantityChange = (delta) => setQuantity(Math.max(1, quantity + delta));

  const prev = () => setCurrentIndex(i => (i - 1 + images.length) % images.length);
  const next = () => setCurrentIndex(i => (i + 1) % images.length);

  // Touch swipe
  const touchStartX = useRef(null);
  const onTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const onTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) diff > 0 ? next() : prev();
    touchStartX.current = null;
  };

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-6xl mb-4">📦</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h2>
          <Link to="/products" className="text-blue-600 hover:underline font-medium">← Back to Products</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link to="/" className="hover:text-blue-600">Home</Link>
            <span>/</span>
            <Link to="/products" className="hover:text-blue-600">Products</Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">{product.name}</span>
          </div>
        </div>
      </div>

      <section className="py-8 sm:py-12 overflow-visible">
        <div className="container mx-auto px-4 overflow-visible">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-12 lg:overflow-visible">
            {/* Images */}
            <div>
              {/* Main slider + zoom lens wrapper */}
              <div className="relative">
                {/* Main slider */}
                <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-sm mb-3 overflow-hidden">
                  <div
                    ref={imgContainerRef}
                    className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-50 to-blue-50 cursor-zoom-in"
                    onTouchStart={onTouchStart}
                    onTouchEnd={onTouchEnd}
                    onClick={() => setLightboxOpen(true)}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    title="Click to enlarge"
                  >
                    {/* Strip: all images side by side, translateX moves to current */}
                    <div
                      style={{
                        display: 'flex',
                        width: `${images.length * 100}%`,
                        height: '100%',
                        transform: `translateX(-${(currentIndex * 100) / images.length}%)`,
                        transition: 'transform 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                      }}
                    >
                      {images.map((img, i) => (
                        <div
                          key={i}
                          style={{ width: `${100 / images.length}%`, flexShrink: 0, padding: '24px' }}
                          className="flex items-center justify-center"
                        >
                          <img
                            src={img}
                            alt={`${product.name} ${i + 1}`}
                            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                            onError={e => { e.target.style.display = 'none'; }}
                          />
                        </div>
                      ))}
                    </div>

                    {/* Corner decorations */}
                    <div className="absolute top-4 right-4 w-10 h-10 border-t-2 border-r-2 border-blue-200 pointer-events-none z-10" />
                    <div className="absolute bottom-4 left-4 w-10 h-10 border-b-2 border-l-2 border-blue-200 pointer-events-none z-10" />

                    {/* Zoom hint — hide when hovering */}
                    {!hoverPos && (
                      <div className="absolute top-3 left-3 z-20 bg-black/40 backdrop-blur-sm text-white rounded-lg px-2 py-1 flex items-center gap-1 text-xs font-medium pointer-events-none opacity-70">
                        <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                          <path d="M9 3a6 6 0 100 12A6 6 0 009 3zM1 9a8 8 0 1114.32 4.906l3.387 3.387a1 1 0 01-1.414 1.414l-3.387-3.387A8 8 0 011 9z"/>
                          <path d="M9 6v6M6 9h6" stroke="white" strokeWidth="1.5" fill="none"/>
                        </svg>
                        Hover to zoom · Click to enlarge
                      </div>
                    )}

                    {/* Lens crosshair overlay */}
                    {hoverPos && (
                      <div
                        className="absolute pointer-events-none z-20 border-2 border-blue-400/60 rounded-sm bg-blue-400/10"
                        style={{
                          width: `${100 / ZOOM_FACTOR}%`,
                          height: `${100 / ZOOM_FACTOR}%`,
                          left: `${Math.min(100 - 100 / ZOOM_FACTOR, Math.max(0, hoverPos.x * 100 - 50 / ZOOM_FACTOR))}%`,
                          top: `${Math.min(100 - 100 / ZOOM_FACTOR, Math.max(0, hoverPos.y * 100 - 50 / ZOOM_FACTOR))}%`,
                        }}
                      />
                    )}

                    {/* Arrows */}
                    {images.length > 1 && (
                      <>
                        <button
                          onClick={e => { e.stopPropagation(); prev(); }}
                          className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 border border-gray-200 shadow flex items-center justify-center text-gray-700 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-200 z-20 text-xl leading-none"
                          aria-label="Previous image"
                        >‹</button>
                        <button
                          onClick={e => { e.stopPropagation(); next(); }}
                          className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 border border-gray-200 shadow flex items-center justify-center text-gray-700 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-200 z-20 text-xl leading-none"
                          aria-label="Next image"
                        >›</button>

                        {/* Dots */}
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
                          {images.map((_, i) => (
                            <button
                              key={i}
                              onClick={e => { e.stopPropagation(); setCurrentIndex(i); }}
                              className={`rounded-full transition-all duration-200 ${
                                i === currentIndex ? 'w-5 h-2 bg-blue-600' : 'w-2 h-2 bg-gray-300 hover:bg-gray-400'
                              }`}
                              aria-label={`Image ${i + 1}`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Zoom preview panel — fixed position, stays stable while hovering */}
                {hoverPos && images[currentIndex] && (
                  <div
                    className="hidden lg:block fixed bg-white rounded-2xl border-2 border-blue-200 shadow-2xl overflow-hidden z-30"
                    style={{
                      pointerEvents: 'none',
                      width: '400px',
                      height: '400px',
                      top: `${panelTop}px`,
                      left: `${panelLeft}px`,
                    }}
                  >
                    <div
                      style={{
                        width: '100%',
                        height: '100%',
                        backgroundImage: `url(${images[currentIndex]})`,
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: `${ZOOM_FACTOR * 100}%`,
                        backgroundPosition: `${hoverPos.x * 100}% ${hoverPos.y * 100}%`,
                      }}
                    />
                    <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      {ZOOM_FACTOR}x
                    </div>
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-3">
                  {images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentIndex(index)}
                      className={`flex-1 aspect-square bg-white rounded-xl border-2 p-2 transition-all duration-200 hover:scale-105 ${
                        currentIndex === index
                          ? 'border-blue-600 shadow-md ring-2 ring-blue-200'
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${product.name} view ${index + 1}`}
                        className="w-full h-full object-contain"
                        onError={e => { e.target.style.display = 'none'; }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="lg:sticky lg:top-4 lg:self-start">
              <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 sm:p-8 shadow-sm">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 leading-tight">{product.name}</h1>
                {product.series && (
                  <p className="text-blue-600 font-medium mb-4">{product.series} · {product.breakingCapacity}</p>
                )}



                {/* Variant / Amperage Selector */}
                {product.variants && product.variants.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <span className="text-blue-600">⚡</span> Select Rating
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {product.variants.map((variant, i) => (
                        <button
                          key={i}
                          onClick={() => setSelectedVariant(variant)}
                          className={`px-4 py-2 rounded-lg border-2 font-semibold text-sm transition-all duration-200 hover:scale-105 ${
                            selectedVariant === variant
                              ? 'border-blue-600 bg-blue-600 text-white shadow-md'
                              : 'border-gray-200 bg-white text-gray-700 hover:border-blue-400'
                          }`}
                        >
                          {variant.capacity}
                          {variant.size !== undefined && variant.size !== '' && (
                            <span className="block text-xs font-normal opacity-80">Size: {variant.size}</span>
                          )}
                        </button>
                      ))}
                    </div>
                    {selectedVariant && (
                      <p className="mt-2 text-sm text-gray-500">
                        Selected: <span className="font-semibold text-blue-600">{selectedVariant.capacity}</span>
                        {selectedVariant.size !== undefined && selectedVariant.size !== '' && (
                          <span className="ml-2 text-gray-500">· Size: <span className="font-semibold text-gray-700">{selectedVariant.size}</span></span>
                        )}
                        {selectedVariant.poles && selectedVariant.poles !== '—' && (
                          <span className="ml-2">· <span className="font-semibold text-blue-600">{selectedVariant.poles}</span></span>
                        )}
                      </p>
                    )}
                  </div>
                )}

                {/* Specs quick view */}
                {product.specifications && (
                  <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                    <h3 className="font-bold text-gray-900 mb-3">Key Specifications</h3>
                    <ul className="space-y-2">
                      {Object.entries(product.specifications).map(([key, value]) => (
                        <li key={key} className="flex items-start gap-2 text-sm">
                          <span className="text-blue-600 mt-0.5">✓</span>
                          <span className="text-gray-700">
                            <span className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span> {value}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Quantity */}
                <div className="mb-6">
                  <h3 className="font-bold text-gray-900 mb-3">Quantity</h3>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border-2 border-gray-200 rounded-lg overflow-hidden">
                      <button onClick={() => handleQuantityChange(-1)} aria-label="Decrease quantity" className="px-4 py-2 bg-gray-50 hover:bg-gray-100 font-bold text-gray-700">−</button>
                      <input
                        type="number"
                        value={quantity}
                        onChange={e => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-16 text-center font-semibold border-x-2 border-gray-200 py-2 focus:outline-none"
                        min="1"
                        aria-label="Quantity"
                      />
                      <button onClick={() => handleQuantityChange(1)} aria-label="Increase quantity" className="px-4 py-2 bg-gray-50 hover:bg-gray-100 font-bold text-gray-700">+</button>
                    </div>
                  </div>
                </div>

                {/* CTA */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={() => setQuoteOpen(true)}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all text-center shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    Request Quote
                  </button>
                  <a
                    href={(() => {
                      const variant = selectedVariant
                        ? `${selectedVariant.capacity} (${selectedVariant.poles})`
                        : 'Not selected';
                      const msg = `Hello GK2,\n\nI'm interested in the following product:\n\n*Product:* ${product.name}\n*Series:* ${product.series || 'N/A'}\n*Rating:* ${variant}\n*Quantity:* ${quantity}\n\nPlease share availability and pricing details.\n\nThank you.`;
                      return `https://wa.me/918460645021?text=${encodeURIComponent(msg)}`;
                    })()}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bc5a] text-white px-6 py-4 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 flex-shrink-0">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.528 5.855L.057 23.882a.5.5 0 0 0 .61.61l6.086-1.461A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 0 1-5.006-1.371l-.36-.214-3.724.894.924-3.638-.235-.374A9.818 9.818 0 1 1 12 21.818z"/>
                    </svg>
                    WhatsApp
                  </a>
                </div>

                {/* Trust Badges */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div><div className="text-2xl mb-1">✓</div><div className="text-xs text-gray-600">Genuine Product</div></div>
                    <div><div className="text-2xl mb-1">🚚</div><div className="text-xs text-gray-600">Fast Delivery</div></div>
                    <div><div className="text-2xl mb-1">🔒</div><div className="text-xs text-gray-600">Secure Payment</div></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Features */}
          {product.features && product.features.length > 0 && (
            <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 sm:p-8 mb-12 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <span className="text-blue-600">⚡</span> Features
              </h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {product.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-gray-700">
                    <span className="text-blue-600 mt-0.5 font-bold">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Technical Specifications */}
          {product.specifications && (
            <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 sm:p-8 mb-12 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <span className="text-blue-600">📋</span> Technical Specifications
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center py-3 border-b border-gray-200">
                    <span className="text-gray-600 font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                    <span className="font-semibold text-gray-900">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <span className="text-blue-600">🔗</span> You May Also Like
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map(related => (
                  <Link
                    key={related.id}
                    to={`/products/${related.id}`}
                    className="group bg-white rounded-xl border-2 border-gray-200 hover:border-blue-400 transition-all duration-300 hover:shadow-xl overflow-hidden transform hover:scale-105"
                  >
                    <div className="bg-gradient-to-br from-gray-50 to-blue-50 aspect-square flex items-center justify-center p-6">
                      <ImageWithFallback
                        src={related.image}
                        alt={related.name}
                        className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">{related.name}</h3>
                      <div className="flex items-center justify-end">
                        <span className="text-sm text-blue-600 font-medium group-hover:translate-x-1 transition-transform">View →</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* LIGHTBOX */}
      {lightboxOpen && (
        <Lightbox images={images} startIndex={currentIndex} onClose={() => setLightboxOpen(false)} />
      )}

      {/* QUOTE MODAL */}
      <QuoteModal
        isOpen={quoteOpen}
        onClose={() => setQuoteOpen(false)}
        initialProduct={product ? { id: product.id, variants: product.variants } : null}
      />
    </div>
  );
}

export default ProductDetail;
