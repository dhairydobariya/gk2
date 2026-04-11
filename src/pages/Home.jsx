import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import logo from "../assets/logo.png";
import DynamicBanner from "../components/DynamicBanner";
import { getProductsData } from "../utils/dataManager";
import useSEO from "../hooks/useSEO";

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

// Featured product card with per-card skeleton loader
function FeaturedCard({ product }) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  return (
    <div className="relative">
      {/* Skeleton overlay until image loads */}
      {!loaded && !error && (
        <div className="absolute inset-0 z-10 bg-white rounded-xl sm:rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-pulse">
          <div className="aspect-square bg-gradient-to-br from-slate-100 to-blue-50" />
          <div className="p-3 sm:p-5 space-y-2">
            <div className="h-3 bg-gray-200 rounded-lg w-1/2 hidden sm:block" />
            <div className="h-4 bg-gray-200 rounded-lg w-3/4" />
            <div className="h-3 bg-gray-100 rounded-lg w-1/3 mt-2" />
          </div>
        </div>
      )}
      <Link to={`/products/${product.id}`}
        className={`card-hover group bg-white rounded-xl sm:rounded-2xl overflow-hidden border border-gray-100 shadow-sm block ${loaded || error ? 'opacity-100' : 'opacity-0'}`}
        style={{ transition: 'opacity 0.3s ease' }}>
        <div className="relative bg-gradient-to-br from-slate-50 to-blue-50 aspect-square overflow-hidden">
          <img src={product.image} alt={product.name}
            className="w-full h-full object-contain p-4 sm:p-6 group-hover:scale-105 transition-transform duration-500"
            loading="eager"
            fetchpriority="high"
            onLoad={() => setLoaded(true)}
            onError={() => { setError(true); setLoaded(true); }} />
          {product.breakingCapacity && product.breakingCapacity !== '—' && (
            <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              {product.breakingCapacity}
            </div>
          )}
        </div>
        <div className="p-3 sm:p-5">
          <p className="text-xs text-blue-500 font-semibold uppercase tracking-wide mb-1 hidden sm:block">{product.series}</p>
          <h3 className="font-bold text-gray-900 text-xs sm:text-base mb-2 sm:mb-3 group-hover:text-blue-600 transition-colors leading-snug">{product.name}</h3>
          <div className="flex items-center justify-between">
            <span className="text-xs bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded-full font-semibold">
              {product.variants?.length || 0} Variants
            </span>
            <span className="text-blue-600 text-xs sm:text-sm font-semibold group-hover:translate-x-1 transition-transform duration-200 inline-block">View →</span>
          </div>
        </div>
      </Link>
    </div>
  );
}

// Combined card for HRC Fuse Base + Link
function FuseCombinedCard({ fuseBase, fuseLink }) {
  return (
    <div className="card-hover group bg-white rounded-xl sm:rounded-2xl overflow-hidden border border-gray-100 shadow-sm block">
      <div className="relative bg-gradient-to-br from-slate-50 to-blue-50 aspect-square overflow-hidden flex items-center justify-center gap-2 p-4 sm:p-6">
        <Link to={`/products/${fuseBase.id}`} className="flex-1 h-full flex items-center justify-center hover:scale-105 transition-transform duration-300">
          <img src={fuseBase.image} alt={fuseBase.name} className="w-full h-full object-contain" loading="eager" />
        </Link>
        <div className="w-px h-3/4 bg-blue-100 shrink-0" />
        <Link to={`/products/${fuseLink.id}`} className="flex-1 h-full flex items-center justify-center hover:scale-105 transition-transform duration-300">
          <img src={fuseLink.image} alt={fuseLink.name} className="w-full h-full object-contain" loading="eager" />
        </Link>
        <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">80KA</div>
      </div>
      <div className="p-3 sm:p-5">
        <p className="text-xs text-blue-500 font-semibold uppercase tracking-wide mb-1 hidden sm:block">HRC Series</p>
        <h3 className="font-bold text-gray-900 text-xs sm:text-base mb-2 sm:mb-3 leading-snug">HRC Fuse Base & Link</h3>
        <div className="flex items-center justify-between gap-2">
          <div className="flex gap-1.5">
            <Link to={`/products/${fuseBase.id}`} className="text-xs bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded-full font-semibold hover:bg-blue-600 hover:text-white transition-colors">Base</Link>
            <Link to={`/products/${fuseLink.id}`} className="text-xs bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded-full font-semibold hover:bg-blue-600 hover:text-white transition-colors">Link</Link>
          </div>
          <Link to="/products?category=fuse" className="text-blue-600 text-xs sm:text-sm font-semibold group-hover:translate-x-1 transition-transform duration-200 inline-block">View →</Link>
        </div>
      </div>
    </div>
  );
}
const stats = [
  { value: "10+",  label: "Years of Excellence" },
  { value: "12+",  label: "Product Categories"  },
  { value: "50+",  label: "Industry Partners"   },
  { value: "IS/IEC", label: "Certified Products" },
];

const advantages = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-7 h-7">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      </svg>
    ),
    title: "Superior Quality",
    desc: "Every product manufactured to IEC/IS standards with rigorous multi-stage quality testing before dispatch.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-7 h-7">
        <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
      </svg>
    ),
    title: "Wide Product Range",
    desc: "MCBs, busbars, fuses, changeover switches and more — 6A to 1000A ratings covering every protection need.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-7 h-7">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
    title: "Certified & Trusted",
    desc: "IS/IEC certified products trusted by 50+ industry partners across residential, commercial and industrial sectors.",
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
  { name: "Residential", desc: "Homes & Apartments", color: "from-blue-500 to-blue-600", bg: "bg-blue-50", border: "border-blue-100", iconColor: "text-blue-600",
    icon: (<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-10 h-10"><path d="M6 20L24 6l18 14v22H30V30h-12v12H6V20z" strokeLinejoin="round"/><rect x="20" y="34" width="8" height="8" rx="1"/><path d="M16 20h4v6h-4zM28 20h4v6h-4z"/></svg>),
  },
  { name: "Commercial", desc: "Offices & Retail", color: "from-indigo-500 to-indigo-600", bg: "bg-indigo-50", border: "border-indigo-100", iconColor: "text-indigo-600",
    icon: (<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-10 h-10"><rect x="8" y="10" width="32" height="32" rx="2"/><path d="M8 18h32M8 26h32M8 34h32M16 10v32M24 10v32M32 10v32"/><rect x="18" y="36" width="12" height="6" rx="1"/></svg>),
  },
  { name: "Industrial", desc: "Factories & Plants", color: "from-sky-500 to-sky-600", bg: "bg-sky-50", border: "border-sky-100", iconColor: "text-sky-600",
    icon: (<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-10 h-10"><path d="M4 38V22l10-8v8l10-8v8l10-8v24H4z" strokeLinejoin="round"/><rect x="34" y="20" width="10" height="18" rx="1"/><path d="M10 38v-8h6v8M22 38v-8h6v8"/><path d="M36 20V14M39 20V16M42 20V14"/></svg>),
  },
  { name: "Infrastructure", desc: "Roads & Bridges", color: "from-cyan-500 to-cyan-600", bg: "bg-cyan-50", border: "border-cyan-100", iconColor: "text-cyan-600",
    icon: (<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-10 h-10"><path d="M4 34 Q24 14 44 34"/><line x1="4" y1="34" x2="44" y2="34"/><line x1="14" y1="34" x2="18" y2="24"/><line x1="24" y1="34" x2="24" y2="20"/><line x1="34" y1="34" x2="30" y2="24"/><line x1="4" y1="34" x2="4" y2="42"/><line x1="44" y1="34" x2="44" y2="42"/></svg>),
  },
  { name: "Manufacturing", desc: "Production Lines", color: "from-blue-600 to-blue-700", bg: "bg-blue-50", border: "border-blue-100", iconColor: "text-blue-700",
    icon: (<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-10 h-10"><circle cx="24" cy="24" r="8"/><circle cx="24" cy="24" r="3"/><path d="M24 6v6M24 36v6M6 24h6M36 24h6"/><path d="M11.5 11.5l4.2 4.2M32.3 32.3l4.2 4.2M11.5 36.5l4.2-4.2M32.3 15.7l4.2-4.2"/></svg>),
  },
  { name: "Energy", desc: "Power & Utilities", color: "from-yellow-500 to-orange-500", bg: "bg-yellow-50", border: "border-yellow-100", iconColor: "text-yellow-600",
    icon: (<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-10 h-10"><path d="M26 4L10 26h14l-2 18L38 22H24L26 4z" strokeLinejoin="round"/></svg>),
  },
];

// ── UPDATED: broader standards covering full product range ──
const standards = [
  { label: "MCB Standard",      value: "IEC 60898-1", color: "bg-blue-600" },
  { label: "Switchgear Std",    value: "IS/IEC 60947-3", color: "bg-indigo-600" },
  { label: "Fuse Standard",     value: "IS:13703 / IEC:269", color: "bg-sky-600" },
  { label: "Origin",            value: "Made in India", color: "bg-blue-800" },
];

// ── NEW: category icons for the category strip ──
const categoryIcons = {
  "mcb": (<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-7 h-7"><rect x="6" y="4" width="20" height="24" rx="2"/><path d="M11 10h10M11 14h10M11 18h6"/><circle cx="20" cy="20" r="2"/></svg>),
  "reverse-forward": (<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-7 h-7"><path d="M6 10h14l-4-4M26 22H12l4 4"/><path d="M20 10l4 4-4 4M12 22l-4-4 4-4"/></svg>),
  "busbar": (<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-7 h-7"><rect x="4" y="13" width="24" height="6" rx="1"/><line x1="8" y1="13" x2="8" y2="8"/><line x1="14" y1="13" x2="14" y2="8"/><line x1="20" y1="13" x2="20" y2="8"/><line x1="8" y1="19" x2="8" y2="24"/><line x1="14" y1="19" x2="14" y2="24"/><line x1="20" y1="19" x2="20" y2="24"/></svg>),
  "fuse": (<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-7 h-7"><rect x="10" y="8" width="12" height="16" rx="2"/><line x1="4" y1="16" x2="10" y2="16"/><line x1="22" y1="16" x2="28" y2="16"/><path d="M13 12l6 8M19 12l-6 8"/></svg>),
  "switch-disconnector-fuse": (<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-7 h-7"><rect x="6" y="6" width="20" height="20" rx="2"/><path d="M11 16h10M16 11v10"/><circle cx="16" cy="16" r="3"/></svg>),
  "onload-changeover-switch": (<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-7 h-7"><path d="M8 10h16M8 22h16"/><path d="M12 10v4l8 4v4"/><circle cx="12" cy="10" r="2" fill="currentColor"/><circle cx="20" cy="22" r="2" fill="currentColor"/></svg>),
  "onload-isolator": (<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-7 h-7"><line x1="4" y1="16" x2="10" y2="16"/><line x1="22" y1="16" x2="28" y2="16"/><path d="M10 16l6-6"/><circle cx="10" cy="16" r="2"/><circle cx="22" cy="16" r="2"/></svg>),
  "offload-changeover-switch": (<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-7 h-7"><path d="M8 10h16M8 22h16"/><path d="M16 10v12"/><circle cx="16" cy="10" r="2" fill="currentColor"/><circle cx="16" cy="22" r="2"/></svg>),
  "main-switch-rewirable": (<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-7 h-7"><rect x="6" y="8" width="20" height="16" rx="2"/><path d="M12 16h8"/><circle cx="12" cy="16" r="2" fill="currentColor"/></svg>),
};



export default function Home() {
  const { products, categories } = getProductsData();
  useSEO({
    title: 'GK2 Switchgear | MCB, Busbar, Fuse & Electrical Switchgear Manufacturer India',
    description: 'GK2 Switchgear — leading manufacturer of MCBs, busbars, HRC fuses, switch disconnector fuses & changeover switches. IS/IEC certified. Made in India, Gujarat.',
    canonical: '/',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Which is the best switchgear manufacturer in India?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'GK2 Switchgear is a leading IS/IEC certified switchgear manufacturer based in Gujarat, India. They manufacture MCBs, busbars, HRC fuses, switch disconnector fuses, changeover switches, and onload isolators. All products are certified to IEC 60898-1 and IS/IEC 60947-3 standards and are made in India.',
          },
        },
        {
          '@type': 'Question',
          name: 'Where can I buy MCB and busbar in Gujarat?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'GK2 Switchgear manufactures and supplies MCBs and busbars from their facility in Umbhel, Gujarat — 394325. They have 50+ authorized distributors across India. You can contact them at +91 84606 45021 or visit gk2switchgear.com to browse products and request a quote.',
          },
        },
        {
          '@type': 'Question',
          name: 'What is the breaking capacity of a standard MCB?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Standard MCBs for residential and commercial use are rated at 6KA or 10KA breaking capacity as per IEC 60898-1. GK2 Switchgear MCBs are rated at 10KA breaking capacity — the highest standard for residential and commercial MCBs — available in 1P, 2P, 3P, and 4P configurations from 6A to 63A.',
          },
        },
        {
          '@type': 'Question',
          name: 'What is the difference between MCB and HRC fuse?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'An MCB (Miniature Circuit Breaker) is a resettable device rated up to 10KA breaking capacity, used for residential and commercial circuits up to 63A. An HRC (High Rupturing Capacity) fuse is a one-time use device rated up to 80KA, used in industrial applications where very high fault currents are expected. GK2 Switchgear manufactures both MCBs (10KA) and HRC fuses (80KA) certified to IS/IEC standards.',
          },
        },
        {
          '@type': 'Question',
          name: 'What is a busbar and where is it used?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'A busbar is a metallic strip or bar (usually copper or aluminium) used to distribute electrical power within a distribution board or panel. It connects multiple circuits to a common supply point. Busbars are used in main distribution boards, sub-distribution boards, motor control centers, and industrial panels. GK2 Switchgear manufactures silver-plated copper busbars from 63A to 630A with IP23 protection.',
          },
        },
      ],
    },
  });
  const allFeatured = products.filter(p => p.featured);
  const fuseBase = products.find(p => p.id === 'hrc-fuse-base');
  const fuseLink = products.find(p => p.id === 'hrc-fuse-link');
  // Build featured list: replace hrc-fuse-base with combined slot, exclude hrc-fuse-link
  const featured = allFeatured
    .filter(p => p.id !== 'hrc-fuse-link')
    .slice(0, 4);

  const statsRef    = useReveal();
  const catRef      = useReveal();
  const prodRef     = useReveal();
  const advRef      = useReveal();
  const qualRef     = useReveal();
  const qualGridRef = useReveal();
  const indRef      = useReveal();
  const ctaRef      = useReveal();

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <style>{`
        .reveal-section { opacity: 0; transform: translateY(36px); transition: opacity 0.7s ease, transform 0.7s ease; }
        .reveal-section.is-visible { opacity: 1; transform: translateY(0); }
        .stagger-child > * { opacity: 0; transform: translateY(24px); transition: opacity 0.55s ease, transform 0.55s ease; }
        .stagger-child.is-visible > *:nth-child(1){opacity:1;transform:translateY(0);transition-delay:0ms}
        .stagger-child.is-visible > *:nth-child(2){opacity:1;transform:translateY(0);transition-delay:80ms}
        .stagger-child.is-visible > *:nth-child(3){opacity:1;transform:translateY(0);transition-delay:160ms}
        .stagger-child.is-visible > *:nth-child(4){opacity:1;transform:translateY(0);transition-delay:240ms}
        .stagger-child.is-visible > *:nth-child(5){opacity:1;transform:translateY(0);transition-delay:320ms}
        .stagger-child.is-visible > *:nth-child(6){opacity:1;transform:translateY(0);transition-delay:400ms}
        .stagger-child.is-visible > *:nth-child(7){opacity:1;transform:translateY(0);transition-delay:480ms}
        .stagger-child.is-visible > *:nth-child(8){opacity:1;transform:translateY(0);transition-delay:560ms}
        .stagger-child.is-visible > *:nth-child(9){opacity:1;transform:translateY(0);transition-delay:640ms}
        .card-hover { transition: transform 0.3s ease, box-shadow 0.3s ease; }
        .card-hover:hover { transform: translateY(-6px); box-shadow: 0 20px 40px rgba(37,99,235,0.12); }
      `}</style>

      {/* 1. HERO BANNER */}
      <DynamicBanner page="home" />

      {/* 2. STATS — updated with credible numbers */}
      <section className="bg-[#1e3a8a] py-8 sm:py-14">
        <div className="container mx-auto px-4 max-w-5xl">
          <div ref={statsRef} className="stagger-child grid grid-cols-2 md:grid-cols-4 divide-x divide-blue-700">
            {stats.map((s, i) => (
              <div key={i} className="text-center px-3 sm:px-6 py-3 sm:py-4">
                <div className="text-2xl sm:text-4xl md:text-5xl font-black text-white mb-1 tracking-tight">{s.value}</div>
                <div className="text-blue-300 text-xs sm:text-sm font-medium tracking-wide">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. TRUST / CERTIFICATIONS BAR — infinite marquee */}
      <div className="bg-white border-y border-gray-100 py-3 overflow-hidden">
        <style>{`
          @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
          .marquee-track { display: flex; width: max-content; animation: marquee 22s linear infinite; }
          .marquee-track:hover { animation-play-state: paused; }
        `}</style>
        <div className="marquee-track">
          {[...Array(2)].map((_, ri) => (
            <div key={ri} className="flex items-center">
              {[
                { label: "IEC 60898-1 Certified", icon: "🏅" },
                { label: "IS:13703 Compliant",    icon: "✅" },
                { label: "IS/IEC 60947-3",        icon: "✅" },
                { label: "Made in India",          icon: "🇮🇳" },
                { label: "10KA Breaking Capacity", icon: "⚡" },
                { label: "80KA HRC Fuses",         icon: "🔒" },
              ].map((t, i) => (
                <div key={i} className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-600 font-medium whitespace-nowrap px-6 sm:px-8">
                  <span>{t.icon}</span>
                  <span>{t.label}</span>
                  <span className="ml-6 sm:ml-8 text-gray-300">|</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* 4. PRODUCT CATEGORIES STRIP */}
      <section className="py-14 sm:py-20 bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div ref={catRef} className="reveal-section">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-8 sm:mb-12 gap-3">
              <div>
                <span className="inline-block text-blue-600 font-semibold text-xs tracking-widest uppercase mb-2 border-l-4 border-blue-600 pl-3">What We Make</span>
                <h2 className="text-3xl sm:text-4xl font-black text-gray-900">Product Categories</h2>
              </div>
              <Link to="/products" className="inline-flex items-center gap-2 text-blue-600 font-semibold text-sm border border-blue-200 rounded-lg px-4 py-2 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-200 self-start sm:self-auto">
                Browse All →
              </Link>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
              {categories.map((cat) => {
                const count = products.filter(p => p.category === cat.id).length;
                return (
                  <Link key={cat.id} to={`/products?category=${cat.id}`}
                    className="group flex flex-col items-center text-center p-4 sm:p-5 bg-white rounded-xl sm:rounded-2xl border border-gray-100 shadow-sm hover:border-blue-300 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-3 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                      {categoryIcons[cat.id] || (
                        <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-7 h-7">
                          <rect x="6" y="6" width="20" height="20" rx="2"/><path d="M11 16h10M16 11v10"/>
                        </svg>
                      )}
                    </div>
                    <p className="font-bold text-gray-900 text-xs sm:text-sm leading-snug group-hover:text-blue-600 transition-colors">{cat.name}</p>
                    <span className="mt-1.5 text-xs font-semibold bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      {count}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 5. FEATURED PRODUCTS */}
      <section className="py-14 sm:py-24 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div ref={prodRef} className="reveal-section">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-8 sm:mb-14 gap-3">
              <div>
                <span className="inline-block text-blue-600 font-semibold text-xs tracking-widest uppercase mb-2 sm:mb-3 border-l-4 border-blue-600 pl-3">Our Products</span>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 leading-tight">Our Best Products</h2>
              </div>
              <Link to="/products" className="inline-flex items-center gap-2 text-blue-600 font-semibold text-sm border border-blue-200 rounded-lg px-4 py-2 sm:px-5 sm:py-2.5 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-200 self-start sm:self-auto">
                View All →
              </Link>
            </div>
            {/* No stagger animation — cards load independently with their own skeleton */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              {featured.map((product) => (
                product.id === 'hrc-fuse-base' && fuseBase && fuseLink
                  ? <FuseCombinedCard key="fuse-combined" fuseBase={fuseBase} fuseLink={fuseLink} />
                  : <FeaturedCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6. WHY CHOOSE GK2 */}
      <section className="py-14 sm:py-24 bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-10 sm:mb-16">
            <span className="inline-flex items-center gap-1.5 text-blue-600 font-semibold text-xs tracking-widest uppercase mb-3 border-b-2 border-blue-600 pb-1">
              Why <img src={logo} alt="GK2" width="696" height="358" className="h-3.5 w-auto" style={{ filter: "invert(29%) sepia(98%) saturate(1500%) hue-rotate(210deg) brightness(90%)" }} />
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 mt-3 flex items-center justify-center gap-3 flex-wrap">
              The <img src={logo} alt="GK2" width="696" height="358" className="h-9 sm:h-11 md:h-12 w-auto inline-block" /> Advantage
            </h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto text-sm sm:text-lg">Built on decades of manufacturing expertise and an uncompromising commitment to quality.</p>
          </div>
          <div ref={advRef} className="stagger-child grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
            {advantages.map((a, i) => (
              <div key={i} className="card-hover group relative bg-white border border-gray-100 rounded-2xl p-6 sm:p-8 shadow-sm hover:border-blue-200">
                <div className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl bg-gradient-to-r from-blue-600 to-blue-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-4 sm:mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                  {a.icon}
                </div>
                <h3 className="font-bold text-gray-900 text-base sm:text-lg mb-2 sm:mb-3 group-hover:text-blue-600 transition-colors">{a.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* 8. QUALITY & STANDARDS — updated to cover full range */}
      <section className="py-14 sm:py-24 bg-[#0f172a] relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.1) 1px,transparent 1px)", backgroundSize: "50px 50px" }} />
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        <div className="container mx-auto px-4 max-w-6xl relative">
          <div ref={qualRef} className="reveal-section grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-16 items-center">
            <div>
              <span className="inline-block text-blue-400 font-semibold text-xs tracking-widest uppercase mb-3 sm:mb-4 border-l-4 border-blue-500 pl-3">Quality & Standards</span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight mb-4 sm:mb-6">
                Built to the<br /><span className="text-blue-400">Highest Standards</span>
              </h2>
              <p className="text-slate-400 text-base sm:text-lg leading-relaxed mb-7 sm:mb-10">
                Every <img src={logo} alt="GK2" width="696" height="358" className="h-4 w-auto inline-block mx-0.5 align-middle" style={{ filter: "brightness(0) invert(1)" }} /> product — from MCBs to busbars to changeover switches — is engineered and tested to meet international electrical safety standards, giving you confidence in every installation.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link to="/products" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 sm:px-7 py-3 sm:py-3.5 rounded-xl font-semibold transition-all duration-200 shadow-lg shadow-blue-900/40 text-sm sm:text-base">
                  Explore Products →
                </Link>
                <Link to="/about" className="inline-flex items-center gap-2 border border-slate-600 hover:border-blue-500 text-slate-300 hover:text-white px-5 sm:px-7 py-3 sm:py-3.5 rounded-xl font-semibold transition-all duration-200 text-sm sm:text-base">
                  About Us
                </Link>
              </div>
            </div>
            <div ref={qualGridRef} className="stagger-child grid grid-cols-2 gap-3 sm:gap-4">
              {standards.map((s, i) => (
                <div key={i} className="card-hover bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:border-blue-500/40 backdrop-blur-sm">
                  <div className={`w-2 h-6 sm:h-8 ${s.color} rounded-full mb-3 sm:mb-4`} />
                  <p className="text-slate-400 text-xs font-medium uppercase tracking-wide mb-1">{s.label}</p>
                  <p className="text-white font-black text-sm sm:text-lg leading-tight">{s.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 9. INDUSTRIES — fixed copy */}
      <section className="py-14 sm:py-24 bg-white overflow-hidden">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-10 sm:mb-16">
            <span className="inline-block text-blue-600 font-semibold text-xs tracking-widest uppercase mb-3 border-b-2 border-blue-600 pb-1">Sectors We Serve</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 mt-3">Industries We Power</h2>
            <p className="text-gray-500 mt-3 max-w-lg mx-auto text-sm sm:text-base flex items-center justify-center gap-1.5 flex-wrap">
              From homes to heavy industry — <img src={logo} alt="GK2" width="696" height="358" className="h-4 w-auto inline-block" /> switchgear protects every kind of electrical installation.
            </p>
          </div>
          <div ref={indRef} className="stagger-child grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
            {industries.map((ind, i) => (
              <div key={i} className={`group relative flex items-center gap-4 p-4 sm:p-6 rounded-xl sm:rounded-2xl border ${ind.border} ${ind.bg} overflow-hidden cursor-default transition-all duration-300 hover:shadow-lg hover:-translate-y-1`}>
                <div className={`absolute -right-6 -bottom-6 w-28 h-28 rounded-full bg-gradient-to-br ${ind.color} opacity-10 group-hover:opacity-20 transition-opacity duration-300`} />
                <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-xl sm:rounded-l-2xl bg-gradient-to-b ${ind.color} scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-top`} />
                <div className={`relative flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 rounded-xl bg-white shadow-sm flex items-center justify-center ${ind.iconColor}`}>
                  {ind.icon}
                </div>
                <div className="relative">
                  <h3 className="font-black text-gray-900 text-base sm:text-lg leading-tight">{ind.name}</h3>
                  <p className="text-gray-500 text-xs sm:text-sm mt-0.5">{ind.desc}</p>
                  {/* ── FIXED: generic copy instead of MCB-only ── */}
                  <div className={`mt-1.5 inline-flex items-center gap-1 text-xs font-semibold`}>
                    <img src={logo} alt="GK2" width="696" height="358" className="h-5 w-auto inline-block align-middle" /> <span className="align-middle">Protected</span> <span className="text-gray-400 align-middle">→</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. CTA — updated copy */}
      <section className="py-14 sm:py-24 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <div ref={ctaRef} className="reveal-section relative bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl sm:rounded-3xl p-8 sm:p-12 md:p-16 text-center overflow-hidden shadow-2xl shadow-blue-200">
            <div className="absolute -top-16 -right-16 w-64 h-64 bg-white/5 rounded-full" />
            <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-white/5 rounded-full" />
            <div className="absolute top-4 left-4 sm:top-6 sm:left-6">
              <img src={logo} alt="GK2" width="696" height="358" className="h-8 sm:h-10 w-auto opacity-30" style={{ filter: "brightness(0) invert(1)" }} />
            </div>
            <div className="relative">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-3 sm:mb-4 leading-tight">
                Ready to Protect Your<br />Electrical Systems?
              </h2>
              <p className="text-blue-200 text-sm sm:text-lg mb-7 sm:mb-10 max-w-xl mx-auto">
                Get in touch with our team for expert electrical switchgear solutions tailored to your residential, commercial, or industrial requirements.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <Link to="/products" className="px-7 sm:px-9 py-3.5 sm:py-4 bg-white text-blue-700 rounded-xl font-bold hover:bg-blue-50 transition-colors duration-200 shadow-lg text-sm sm:text-base">
                  Browse Products
                </Link>
                <a href="https://wa.me/918460645021?text=Hello%20GK2%2C%20I%20would%20like%20to%20enquire%20about%20your%20products."
                  target="_blank" rel="noreferrer"
                  className="px-7 sm:px-9 py-3.5 sm:py-4 bg-[#25D366] hover:bg-[#20bc5a] text-white rounded-xl font-bold transition-colors duration-200 shadow-lg text-sm sm:text-base flex items-center justify-center gap-2">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 flex-shrink-0">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.528 5.855L.057 23.882a.5.5 0 0 0 .61.61l6.086-1.461A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 0 1-5.006-1.371l-.36-.214-3.724.894.924-3.638-.235-.374A9.818 9.818 0 1 1 12 21.818z"/>
                  </svg>
                  WhatsApp Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 11. FLOATING WHATSAPP BUTTON — new */}
      <a href="https://wa.me/918460645021?text=Hello%20GK2%2C%20I%20would%20like%20to%20enquire%20about%20your%20products."
        target="_blank" rel="noreferrer" aria-label="Chat on WhatsApp"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#25D366] hover:bg-[#20bc5a] text-white rounded-full shadow-lg hover:shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-110">
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.528 5.855L.057 23.882a.5.5 0 0 0 .61.61l6.086-1.461A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 0 1-5.006-1.371l-.36-.214-3.724.894.924-3.638-.235-.374A9.818 9.818 0 1 1 12 21.818z"/>
        </svg>
      </a>
    </div>
  );
}
