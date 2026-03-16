import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";
import logo from "../assets/logo.png";
import DynamicBanner from "../components/DynamicBanner";
import { getProductsData } from "../utils/dataManager";

function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add("is-visible"); obs.disconnect(); } },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

const stats = [
  { value: "10+",  label: "Years of Excellence" },
  { value: "500+", label: "Products Delivered"  },
  { value: "50+",  label: "Industry Partners"   },
  { value: "100%", label: "Quality Certified"   },
];

const advantages = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-7 h-7">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      </svg>
    ),
    title: "Superior Quality",
    desc: "Every MCB manufactured to IEC 60898-1 standards with 10KA breaking capacity and rigorous quality testing.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-7 h-7">
        <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
      </svg>
    ),
    title: "Wide Product Range",
    desc: "Single pole, double pole, modular and tiny MCBs — 6A to 32A ratings covering every protection need.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-7 h-7">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
    title: "Certified & Trusted",
    desc: "IEC certified products trusted by 50+ industry partners across residential, commercial and industrial sectors.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-7 h-7">
        <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
      </svg>
    ),
    title: "Fast & Reliable Supply",
    desc: "Efficient distribution network ensuring timely delivery of genuine products across India.",
  },
];

const industries = [
  {
    name: "Residential",
    desc: "Homes & Apartments",
    color: "from-blue-500 to-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-100",
    iconColor: "text-blue-600",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-10 h-10">
        <path d="M6 20L24 6l18 14v22H30V30h-12v12H6V20z" strokeLinejoin="round"/>
        <rect x="20" y="34" width="8" height="8" rx="1"/>
        <path d="M16 20h4v6h-4zM28 20h4v6h-4z"/>
      </svg>
    ),
  },
  {
    name: "Commercial",
    desc: "Offices & Retail",
    color: "from-indigo-500 to-indigo-600",
    bg: "bg-indigo-50",
    border: "border-indigo-100",
    iconColor: "text-indigo-600",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-10 h-10">
        <rect x="8" y="10" width="32" height="32" rx="2"/>
        <path d="M8 18h32M8 26h32M8 34h32M16 10v32M24 10v32M32 10v32"/>
        <rect x="18" y="36" width="12" height="6" rx="1"/>
      </svg>
    ),
  },
  {
    name: "Industrial",
    desc: "Factories & Plants",
    color: "from-sky-500 to-sky-600",
    bg: "bg-sky-50",
    border: "border-sky-100",
    iconColor: "text-sky-600",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-10 h-10">
        <path d="M4 38V22l10-8v8l10-8v8l10-8v24H4z" strokeLinejoin="round"/>
        <rect x="34" y="20" width="10" height="18" rx="1"/>
        <path d="M10 38v-8h6v8M22 38v-8h6v8"/>
        <path d="M36 20V14M39 20V16M42 20V14"/>
      </svg>
    ),
  },
  {
    name: "Infrastructure",
    desc: "Roads & Bridges",
    color: "from-cyan-500 to-cyan-600",
    bg: "bg-cyan-50",
    border: "border-cyan-100",
    iconColor: "text-cyan-600",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-10 h-10">
        <path d="M4 34 Q24 14 44 34"/>
        <line x1="4" y1="34" x2="44" y2="34"/>
        <line x1="14" y1="34" x2="18" y2="24"/>
        <line x1="24" y1="34" x2="24" y2="20"/>
        <line x1="34" y1="34" x2="30" y2="24"/>
        <line x1="4" y1="34" x2="4" y2="42"/>
        <line x1="44" y1="34" x2="44" y2="42"/>
      </svg>
    ),
  },
  {
    name: "Manufacturing",
    desc: "Production Lines",
    color: "from-blue-600 to-blue-700",
    bg: "bg-blue-50",
    border: "border-blue-100",
    iconColor: "text-blue-700",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-10 h-10">
        <circle cx="24" cy="24" r="8"/>
        <circle cx="24" cy="24" r="3"/>
        <path d="M24 6v6M24 36v6M6 24h6M36 24h6"/>
        <path d="M11.5 11.5l4.2 4.2M32.3 32.3l4.2 4.2M11.5 36.5l4.2-4.2M32.3 15.7l4.2-4.2"/>
      </svg>
    ),
  },
  {
    name: "Energy",
    desc: "Power & Utilities",
    color: "from-yellow-500 to-orange-500",
    bg: "bg-yellow-50",
    border: "border-yellow-100",
    iconColor: "text-yellow-600",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-10 h-10">
        <path d="M26 4L10 26h14l-2 18L38 22H24L26 4z" strokeLinejoin="round"/>
      </svg>
    ),
  },
];

const standards = [
  { label: "Breaking Capacity", value: "10KA",        color: "bg-blue-600" },
  { label: "Standard",          value: "IEC 60898-1", color: "bg-indigo-600" },
  { label: "Tripping Curve",    value: "C Series",    color: "bg-sky-600" },
  { label: "Origin",            value: "Made in India", color: "bg-blue-800" },
];

export default function Home() {
  const { products } = getProductsData();
  const featured = products.slice(0, 4);

  const statsRef   = useReveal();
  const prodRef    = useReveal();
  const prodGridRef = useReveal();
  const advRef     = useReveal();
  const qualRef    = useReveal();
  const qualGridRef = useReveal();
  const indRef     = useReveal();
  const ctaRef     = useReveal();

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <style>{`
        .reveal-section { opacity: 0; transform: translateY(36px); transition: opacity 0.7s ease, transform 0.7s ease; }
        .reveal-section.is-visible { opacity: 1; transform: translateY(0); }
        .stagger-child > * { opacity: 0; transform: translateY(24px); transition: opacity 0.55s ease, transform 0.55s ease; }
        .stagger-child.is-visible > *:nth-child(1) { opacity:1;transform:translateY(0);transition-delay:0ms }
        .stagger-child.is-visible > *:nth-child(2) { opacity:1;transform:translateY(0);transition-delay:100ms }
        .stagger-child.is-visible > *:nth-child(3) { opacity:1;transform:translateY(0);transition-delay:200ms }
        .stagger-child.is-visible > *:nth-child(4) { opacity:1;transform:translateY(0);transition-delay:300ms }
        .stagger-child.is-visible > *:nth-child(5) { opacity:1;transform:translateY(0);transition-delay:400ms }
        .stagger-child.is-visible > *:nth-child(6) { opacity:1;transform:translateY(0);transition-delay:500ms }
        .card-hover { transition: transform 0.3s ease, box-shadow 0.3s ease; }
        .card-hover:hover { transform: translateY(-6px); box-shadow: 0 20px 40px rgba(37,99,235,0.12); }
        .section-divider { height: 4px; background: linear-gradient(90deg, #2563eb, #60a5fa, #2563eb); }
      `}</style>

      {/* 1. HERO BANNER */}
      <DynamicBanner page="home" />

      {/* 2. STATS */}
      <section className="bg-[#1e3a8a] py-14">
        <div className="container mx-auto px-4 max-w-5xl">
          <div ref={statsRef} className="stagger-child grid grid-cols-2 md:grid-cols-4 divide-x divide-blue-700">
            {stats.map((s, i) => (
              <div key={i} className="text-center px-6 py-4">
                <div className="text-4xl sm:text-5xl font-black text-white mb-1 tracking-tight">{s.value}</div>
                <div className="text-blue-300 text-sm font-medium tracking-wide">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. FEATURED PRODUCTS */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div ref={prodRef} className="reveal-section">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-14 gap-4">
              <div>
                <span className="inline-block text-blue-600 font-semibold text-xs tracking-widest uppercase mb-3 border-l-4 border-blue-600 pl-3">Our Products</span>
                <h2 className="text-4xl sm:text-5xl font-black text-gray-900 leading-tight">
                  MCB Product Range
                </h2>
              </div>
              <Link to="/products"
                className="inline-flex items-center gap-2 text-blue-600 font-semibold text-sm border border-blue-200 rounded-lg px-5 py-2.5 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-200 self-start sm:self-auto">
                View All Products →
              </Link>
            </div>

            <div ref={prodGridRef} className="stagger-child grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featured.map((product) => (
                <Link key={product.id} to={`/products/${product.id}`}
                  className="card-hover group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
                  {/* Image */}
                  <div className="relative bg-gradient-to-br from-slate-50 to-blue-50 aspect-square overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-contain p-6 group-hover:scale-105 transition-transform duration-500"
                      onError={e => { e.target.style.display = 'none'; }}
                    />
                    <div className="absolute top-3 right-3 bg-blue-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                      {product.breakingCapacity}
                    </div>
                  </div>
                  {/* Info */}
                  <div className="p-5">
                    <p className="text-xs text-blue-500 font-semibold uppercase tracking-wide mb-1">{product.series}</p>
                    <h3 className="font-bold text-gray-900 text-base mb-3 group-hover:text-blue-600 transition-colors leading-snug">{product.name}</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-xs bg-blue-50 text-blue-700 border border-blue-100 px-2.5 py-1 rounded-full font-semibold">
                        {product.variants?.length || 0} Variants
                      </span>
                      <span className="text-blue-600 text-sm font-semibold group-hover:translate-x-1 transition-transform duration-200 inline-block">
                        View →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. WHY CHOOSE GK2 */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <span className="inline-block text-blue-600 font-semibold text-xs tracking-widest uppercase mb-3 border-b-2 border-blue-600 pb-1">Why GK2</span>
            <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mt-3">The GK2 Advantage</h2>
            <p className="text-gray-500 mt-4 max-w-xl mx-auto text-lg">Built on decades of manufacturing expertise and an uncompromising commitment to quality.</p>
          </div>
          <div ref={advRef} className="stagger-child grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {advantages.map((a, i) => (
              <div key={i} className="card-hover group relative bg-white border border-gray-100 rounded-2xl p-8 shadow-sm hover:border-blue-200">
                <div className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl bg-gradient-to-r from-blue-600 to-blue-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                  {a.icon}
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-3 group-hover:text-blue-600 transition-colors">{a.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. QUALITY & STANDARDS */}
      <section className="py-24 bg-[#0f172a] relative overflow-hidden">
        {/* Background texture */}
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.1) 1px,transparent 1px)", backgroundSize: "50px 50px" }} />
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

        <div className="container mx-auto px-4 max-w-6xl relative">
          <div ref={qualRef} className="reveal-section grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left */}
            <div>
              <span className="inline-block text-blue-400 font-semibold text-xs tracking-widest uppercase mb-4 border-l-4 border-blue-500 pl-3">Quality & Standards</span>
              <h2 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-6">
                Built to the<br />
                <span className="text-blue-400">Highest Standards</span>
              </h2>
              <p className="text-slate-400 text-lg leading-relaxed mb-10">
                Every GK2 product is engineered and tested to meet international electrical safety standards — giving you confidence in every installation.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link to="/products"
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-7 py-3.5 rounded-xl font-semibold transition-all duration-200 shadow-lg shadow-blue-900/40">
                  Explore Products →
                </Link>
                <Link to="/about"
                  className="inline-flex items-center gap-2 border border-slate-600 hover:border-blue-500 text-slate-300 hover:text-white px-7 py-3.5 rounded-xl font-semibold transition-all duration-200">
                  About Us
                </Link>
              </div>
            </div>
            {/* Right: spec cards */}
            <div ref={qualGridRef} className="stagger-child grid grid-cols-2 gap-4">
              {standards.map((s, i) => (
                <div key={i} className="card-hover bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-blue-500/40 hover:bg-white/8 backdrop-blur-sm">
                  <div className={`w-2 h-8 ${s.color} rounded-full mb-4`} />
                  <p className="text-slate-400 text-xs font-medium uppercase tracking-wide mb-1">{s.label}</p>
                  <p className="text-white font-black text-xl">{s.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6. INDUSTRIES */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <span className="inline-block text-blue-600 font-semibold text-xs tracking-widest uppercase mb-3 border-b-2 border-blue-600 pb-1">Sectors We Serve</span>
            <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mt-3">Industries We Power</h2>
            <p className="text-gray-500 mt-4 max-w-lg mx-auto text-base">From homes to heavy industry — GK2 MCBs protect every kind of electrical installation.</p>
          </div>

          <div ref={indRef} className="stagger-child grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {industries.map((ind, i) => (
              <div key={i}
                className={`group relative flex items-center gap-5 p-6 rounded-2xl border ${ind.border} ${ind.bg} overflow-hidden cursor-default transition-all duration-300 hover:shadow-lg hover:-translate-y-1`}>
                {/* Decorative circle bg */}
                <div className={`absolute -right-6 -bottom-6 w-28 h-28 rounded-full bg-gradient-to-br ${ind.color} opacity-10 group-hover:opacity-20 transition-opacity duration-300`} />
                {/* Accent bar */}
                <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl bg-gradient-to-b ${ind.color} scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-top`} />

                {/* Icon box */}
                <div className={`relative flex-shrink-0 w-16 h-16 rounded-xl bg-white shadow-sm flex items-center justify-center ${ind.iconColor} group-hover:shadow-md transition-shadow duration-300`}>
                  {ind.icon}
                </div>

                {/* Text */}
                <div className="relative">
                  <h3 className="font-black text-gray-900 text-lg leading-tight group-hover:text-gray-800">{ind.name}</h3>
                  <p className="text-gray-500 text-sm mt-0.5">{ind.desc}</p>
                  <div className={`mt-2 inline-flex items-center gap-1 text-xs font-semibold bg-gradient-to-r ${ind.color} bg-clip-text text-transparent`}>
                    MCB Protected <span className="text-gray-400">→</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. CTA */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <div ref={ctaRef} className="reveal-section relative bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl p-12 sm:p-16 text-center overflow-hidden shadow-2xl shadow-blue-200">
            {/* Decorative circles */}
            <div className="absolute -top-16 -right-16 w-64 h-64 bg-white/5 rounded-full" />
            <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-white/5 rounded-full" />
            <div className="absolute top-6 left-6">
              <img src={logo} alt="GK2" className="h-10 w-auto opacity-30"
                style={{ filter: "brightness(0) invert(1)" }} />
            </div>
            <div className="relative">
              <h2 className="text-3xl sm:text-4xl font-black text-white mb-4 leading-tight">
                Ready to Protect Your<br />Electrical Systems?
              </h2>
              <p className="text-blue-200 text-lg mb-10 max-w-xl mx-auto">
                Get in touch with our team for expert MCB solutions tailored to your residential, commercial, or industrial requirements.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/products"
                  className="px-9 py-4 bg-white text-blue-700 rounded-xl font-bold hover:bg-blue-50 transition-colors duration-200 shadow-lg text-base">
                  Browse Products
                </Link>
                <Link to="/contact"
                  className="px-9 py-4 border-2 border-white/40 text-white rounded-xl font-bold hover:bg-white/10 transition-colors duration-200 text-base">
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
