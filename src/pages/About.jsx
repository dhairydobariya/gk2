import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import DynamicBanner from '../components/DynamicBanner';

function useReveal(threshold = 0.12) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add('ab-vis'); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

const values = [
  {
    title: 'Quality First',
    desc: 'Every MCB leaves our facility only after passing multi-stage quality checks aligned with IEC 60898-1.',
    icon: (
      <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-8 h-8">
        <path d="M16 3l3.5 7 7.5 1.1-5.5 5.3 1.3 7.6L16 20.8l-6.8 3.2 1.3-7.6L5 11.1l7.5-1.1z" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    title: 'Innovation',
    desc: 'Continuous R&D investment keeps our products ahead of evolving industry standards and customer needs.',
    icon: (
      <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-8 h-8">
        <path d="M16 4a8 8 0 0 1 5 14.3V22h-10v-3.7A8 8 0 0 1 16 4z" strokeLinejoin="round"/>
        <path d="M12 22v2a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-2"/>
        <line x1="16" y1="4" x2="16" y2="2"/><line x1="4" y1="16" x2="2" y2="16"/>
        <line x1="28" y1="16" x2="30" y2="16"/>
      </svg>
    ),
  },
  {
    title: 'Customer Trust',
    desc: 'We build long-term partnerships by delivering consistent quality, honest pricing, and reliable after-sales support.',
    icon: (
      <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-8 h-8">
        <path d="M16 28s-12-6-12-14a8 8 0 0 1 12-6.9A8 8 0 0 1 28 14c0 8-12 14-12 14z" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    title: 'Integrity',
    desc: 'Transparent business practices and ethical manufacturing are the foundation of every relationship we build.',
    icon: (
      <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-8 h-8">
        <path d="M16 3l-11 4v8c0 7 5 12 11 14 6-2 11-7 11-14V7z" strokeLinejoin="round"/>
        <path d="M11 16l3 3 7-7"/>
      </svg>
    ),
  },
];

const milestones = [
  { year: 'Day 1', title: 'Founded', desc: 'Established as a focused switchgear manufacturing unit with a clear vision — quality electrical protection for every Indian home and business.' },
  { year: 'Phase 2', title: 'Product Expansion', desc: 'Grew from single-pole MCBs to a full range — double pole, modular, and tiny MCBs covering 6A to 32A ratings.' },
  { year: 'Milestone', title: 'IEC Certification', desc: 'Achieved IEC 60898-1 certification across all product lines, validating our commitment to international safety standards.' },
  { year: 'Today', title: '50+ Partners', desc: 'Trusted by over 50 industry partners across India, powering residential, commercial, and industrial electrical installations.' },
];

const certifications = [
  { label: 'Standard', value: 'IEC 60898-1' },
  { label: 'Breaking Capacity', value: '10,000A' },
  { label: 'Tripping Curve', value: 'C Series' },
  { label: 'Voltage Rating', value: '230 / 400V AC' },
  { label: 'Frequency', value: '50 Hz' },
  { label: 'Origin', value: 'Made in India' },
];

export default function About() {
  const introRef   = useReveal();
  const valuesRef  = useReveal();
  const timelineRef = useReveal();
  const mfgRef     = useReveal();
  const ctaRef     = useReveal();

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <style>{`
        .ab-reveal  { opacity:0; transform:translateY(32px); transition:opacity 0.65s ease,transform 0.65s ease; }
        .ab-reveal.ab-vis { opacity:1; transform:translateY(0); }
        .ab-stagger > * { opacity:0; transform:translateY(22px); transition:opacity 0.55s ease,transform 0.55s ease; }
        .ab-stagger.ab-vis > *:nth-child(1){opacity:1;transform:translateY(0);transition-delay:0ms}
        .ab-stagger.ab-vis > *:nth-child(2){opacity:1;transform:translateY(0);transition-delay:100ms}
        .ab-stagger.ab-vis > *:nth-child(3){opacity:1;transform:translateY(0);transition-delay:200ms}
        .ab-stagger.ab-vis > *:nth-child(4){opacity:1;transform:translateY(0);transition-delay:300ms}
        .ab-stagger.ab-vis > *:nth-child(5){opacity:1;transform:translateY(0);transition-delay:400ms}
        .ab-stagger.ab-vis > *:nth-child(6){opacity:1;transform:translateY(0);transition-delay:500ms}
      `}</style>

      <DynamicBanner page="about" compact />

      {/* ── 1. WHO WE ARE ── */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div ref={introRef} className="ab-reveal grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Left */}
            <div>
              <span className="inline-block text-blue-600 font-semibold text-xs tracking-widest uppercase mb-4 border-l-4 border-blue-600 pl-3">About GK2</span>
              <h2 className="text-4xl sm:text-5xl font-black text-gray-900 leading-tight mb-6">
                India's Trusted<br />
                <span className="text-blue-600">MCB Manufacturer</span>
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-5">
                GK2 is a dedicated Indian manufacturer of electrical switchgear, specializing in Miniature Circuit Breakers built to protect homes, offices, and industrial facilities across the country.
              </p>
              <p className="text-gray-500 leading-relaxed mb-8">
                We combine precision manufacturing with strict quality control — every product that leaves our facility meets IEC 60898-1 standards and is backed by years of engineering expertise.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link to="/products" className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors duration-200 shadow-md shadow-blue-200">
                  View Products →
                </Link>
                <Link to="/contact" className="inline-flex items-center gap-2 border border-gray-200 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:border-blue-400 hover:text-blue-600 transition-colors duration-200">
                  Contact Us
                </Link>
              </div>
            </div>

            {/* Right: brand card */}
            <div className="relative">
              <div className="absolute -inset-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl -z-10" />
              <div className="bg-white rounded-2xl border border-gray-100 shadow-lg p-10 text-center">
                <img src={logo} alt="GK2" className="h-20 w-auto mx-auto mb-6" />
                <div className="w-12 h-1 bg-blue-600 mx-auto rounded-full mb-6" />
                <p className="text-gray-700 text-lg font-medium italic leading-relaxed mb-8">
                  "Powering safety and reliability across India's electrical infrastructure."
                </p>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-blue-50 border border-blue-100 rounded-xl py-3 px-4">
                    <div className="font-black text-blue-700 text-xl">10+</div>
                    <div className="text-gray-500 text-xs mt-0.5">Years Experience</div>
                  </div>
                  <div className="bg-green-50 border border-green-100 rounded-xl py-3 px-4">
                    <div className="font-black text-green-700 text-xl">IEC</div>
                    <div className="text-gray-500 text-xs mt-0.5">60898-1 Certified</div>
                  </div>
                  <div className="bg-indigo-50 border border-indigo-100 rounded-xl py-3 px-4">
                    <div className="font-black text-indigo-700 text-xl">50+</div>
                    <div className="text-gray-500 text-xs mt-0.5">Industry Partners</div>
                  </div>
                  <div className="bg-orange-50 border border-orange-100 rounded-xl py-3 px-4">
                    <div className="font-black text-orange-700 text-xl">🇮🇳</div>
                    <div className="text-gray-500 text-xs mt-0.5">Made in India</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. CORE VALUES ── */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <span className="inline-block text-blue-600 font-semibold text-xs tracking-widest uppercase mb-3 border-b-2 border-blue-600 pb-1">What Drives Us</span>
            <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mt-3">Our Core Values</h2>
            <p className="text-gray-500 mt-4 max-w-lg mx-auto">The principles that guide every product we build and every relationship we form.</p>
          </div>
          <div ref={valuesRef} className="ab-stagger grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <div key={i} className="group relative bg-white border border-gray-100 rounded-2xl p-8 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-blue-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-t-2xl" />
                <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                  {v.icon}
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-3 group-hover:text-blue-600 transition-colors">{v.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. OUR JOURNEY (TIMELINE) ── */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-16">
            <span className="inline-block text-blue-600 font-semibold text-xs tracking-widest uppercase mb-3 border-b-2 border-blue-600 pb-1">Our Journey</span>
            <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mt-3">How We Got Here</h2>
          </div>
          <div ref={timelineRef} className="ab-stagger relative">
            {/* Connecting line */}
            <div className="hidden lg:block absolute top-8 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-100 via-blue-300 to-blue-100" style={{ top: '2rem' }} />
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {milestones.map((m, i) => (
                <div key={i} className="relative flex flex-col items-center text-center lg:items-center">
                  {/* Circle node */}
                  <div className="relative z-10 w-16 h-16 bg-blue-600 text-white rounded-full flex flex-col items-center justify-center shadow-lg shadow-blue-200 mb-5 flex-shrink-0">
                    <span className="text-xs font-bold leading-tight text-center px-1">{m.year}</span>
                  </div>
                  <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 w-full hover:border-blue-200 hover:shadow-md transition-all duration-300">
                    <h3 className="font-bold text-gray-900 text-base mb-2">{m.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{m.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. MANUFACTURING & CERTIFICATIONS (dark) ── */}
      <section className="py-24 bg-[#0f172a] relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.1) 1px,transparent 1px)', backgroundSize: '50px 50px' }} />
        <div className="absolute top-0 left-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

        <div className="container mx-auto px-4 max-w-6xl relative">
          <div ref={mfgRef} className="ab-reveal grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left */}
            <div>
              <span className="inline-block text-blue-400 font-semibold text-xs tracking-widest uppercase mb-4 border-l-4 border-blue-500 pl-3">Manufacturing Excellence</span>
              <h2 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-6">
                Built to the<br />
                <span className="text-blue-400">Highest Standards</span>
              </h2>
              <p className="text-slate-400 text-lg leading-relaxed mb-6">
                Our manufacturing process follows strict quality protocols at every stage — from raw material selection to final testing — ensuring every GK2 MCB performs reliably for years.
              </p>
              <p className="text-slate-400 leading-relaxed mb-10">
                We invest continuously in precision tooling, calibrated testing equipment, and skilled engineering talent to maintain the quality our customers depend on.
              </p>
              <Link to="/products"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-7 py-3.5 rounded-xl font-semibold transition-all duration-200 shadow-lg shadow-blue-900/40">
                Explore Our Products →
              </Link>
            </div>

            {/* Right: cert grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {certifications.map((c, i) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-blue-500/40 hover:bg-white/8 backdrop-blur-sm transition-all duration-300">
                  <p className="text-slate-400 text-xs font-medium uppercase tracking-wide mb-2">{c.label}</p>
                  <p className="text-white font-black text-base leading-tight">{c.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. CTA ── */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <div ref={ctaRef} className="ab-reveal relative bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl p-12 sm:p-16 text-center overflow-hidden shadow-2xl shadow-blue-200">
            <div className="absolute -top-16 -right-16 w-64 h-64 bg-white/5 rounded-full" />
            <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-white/5 rounded-full" />
            <div className="relative">
              <h2 className="text-3xl sm:text-4xl font-black text-white mb-4 leading-tight">
                Ready to Partner With GK2?
              </h2>
              <p className="text-blue-200 text-lg mb-10 max-w-xl mx-auto">
                Get in touch with our team for expert MCB solutions tailored to your residential, commercial, or industrial requirements.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/contact" className="px-9 py-4 bg-white text-blue-700 rounded-xl font-bold hover:bg-blue-50 transition-colors duration-200 shadow-lg text-base">
                  Get in Touch
                </Link>
                <Link to="/products" className="px-9 py-4 border-2 border-white/40 text-white rounded-xl font-bold hover:bg-white/10 transition-colors duration-200 text-base">
                  Browse Products
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
