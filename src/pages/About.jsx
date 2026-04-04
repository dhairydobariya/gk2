import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import DynamicBanner from '../components/DynamicBanner';
import useSEO from '../hooks/useSEO';

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
    desc: 'Every product leaves our facility only after passing multi-stage quality checks aligned with IEC/IS standards.',
    icon: (<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-8 h-8"><path d="M16 3l3.5 7 7.5 1.1-5.5 5.3 1.3 7.6L16 20.8l-6.8 3.2 1.3-7.6L5 11.1l7.5-1.1z" strokeLinejoin="round"/></svg>),
  },
  {
    title: 'Innovation',
    desc: 'Continuous R&D investment keeps our products ahead of evolving industry standards and customer needs.',
    icon: (<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-8 h-8"><path d="M16 4a8 8 0 0 1 5 14.3V22h-10v-3.7A8 8 0 0 1 16 4z" strokeLinejoin="round"/><path d="M12 22v2a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-2"/><line x1="16" y1="4" x2="16" y2="2"/><line x1="4" y1="16" x2="2" y2="16"/><line x1="28" y1="16" x2="30" y2="16"/></svg>),
  },
  {
    title: 'Customer Trust',
    desc: 'We build long-term partnerships by delivering consistent quality, honest pricing, and reliable after-sales support.',
    icon: (<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-8 h-8"><path d="M16 28s-12-6-12-14a8 8 0 0 1 12-6.9A8 8 0 0 1 28 14c0 8-12 14-12 14z" strokeLinejoin="round"/></svg>),
  },
  {
    title: 'Integrity',
    desc: 'Transparent business practices and ethical manufacturing are the foundation of every relationship we build.',
    icon: (<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-8 h-8"><path d="M16 3l-11 4v8c0 7 5 12 11 14 6-2 11-7 11-14V7z" strokeLinejoin="round"/><path d="M11 16l3 3 7-7"/></svg>),
  },
];

const milestones = [
  { year: '2014', title: 'Founded', desc: 'Established as a focused switchgear manufacturing unit with a clear vision — quality electrical protection for every Indian home and business.' },
  { year: '2016', title: 'Product Expansion', desc: 'Grew from MCBs to a full switchgear range — busbars, fuses, changeover switches, and isolators covering 6A to 1000A ratings.' },
  { year: '2019', title: 'IEC Certification', desc: 'Achieved IEC 60898-1 and IS/IEC 60947-3 certifications across product lines, validating our commitment to international safety standards.' },
  { year: '2024', title: '50+ Partners', desc: 'Trusted by over 50 industry partners across India, powering residential, commercial, and industrial electrical installations.' },
];



const mfgHighlights = [
  {
    title: 'Precision Tooling',
    desc: 'State-of-the-art tooling ensures dimensional accuracy and consistent performance across every batch.',
    icon: (<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-7 h-7"><path d="M20 4l8 8-14 14-4 1 1-4L20 4z" strokeLinejoin="round"/><path d="M17 7l8 8"/></svg>),
  },
  {
    title: 'Calibrated Testing',
    desc: 'Every product undergoes multi-stage electrical and mechanical testing on calibrated equipment before dispatch.',
    icon: (<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-7 h-7"><circle cx="16" cy="16" r="12"/><path d="M16 8v8l5 3"/></svg>),
  },
  {
    title: 'Skilled Engineers',
    desc: 'Our team of experienced electrical engineers drives continuous improvement in design, process, and quality.',
    icon: (<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-7 h-7"><circle cx="16" cy="10" r="5"/><path d="M6 28c0-5.5 4.5-10 10-10s10 4.5 10 10"/></svg>),
  },
];

export default function About() {
  useSEO({
    title: 'About GK2 Switchgear | Electrical Manufacturer Gujarat, India',
    description: 'Learn about GK2 Switchgear — a trusted manufacturer of IS/IEC certified electrical switchgear products including MCBs, busbars, fuses and more. Based in Umbhel, Gujarat, India.',
    canonical: '/about',
  });
  const introRef   = useReveal();
  const valuesRef  = useReveal();
  const mfgCommRef = useReveal();
  const timelineRef = useReveal();
  const rangeRef   = useReveal();
  const ctaRef     = useReveal();

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <style>{`
        .ab-reveal { opacity:0; transform:translateY(32px); transition:opacity 0.65s ease,transform 0.65s ease; }
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

      {/* 1. WHO WE ARE */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div ref={introRef} className="ab-reveal grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <span className="inline-block text-blue-600 font-semibold text-xs tracking-widest uppercase mb-4 border-l-4 border-blue-600 pl-3">About GK2</span>
              <h2 className="text-4xl sm:text-5xl font-black text-gray-900 leading-tight mb-6">
                India's Trusted<br />
                <span className="text-blue-600">Switchgear Manufacturer</span>
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-5">
                GK2 is a dedicated Indian manufacturer of electrical switchgear — from MCBs and busbars to fuses, changeover switches, and isolators — built to protect homes, offices, and industrial facilities across the country.
              </p>
              <p className="text-gray-500 leading-relaxed mb-8">
                We combine precision manufacturing with strict quality control. Every product that leaves our facility meets IEC/IS standards and is backed by years of engineering expertise.
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
            <div className="relative">
              <div className="absolute -inset-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl -z-10" />
              <div className="bg-white rounded-2xl border border-gray-100 shadow-lg p-8 sm:p-10 text-center">
                <img src={logo} alt="GK2" className="h-16 sm:h-20 w-auto mx-auto mb-6" />
                <div className="w-12 h-1 bg-blue-600 mx-auto rounded-full mb-6" />
                <p className="text-gray-700 text-base sm:text-lg font-medium italic leading-relaxed mb-8">
                  "Powering safety and reliability across India's electrical infrastructure."
                </p>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-blue-50 border border-blue-100 rounded-xl py-3 px-4">
                    <div className="font-black text-blue-700 text-xl">10+</div>
                    <div className="text-gray-500 text-xs mt-0.5">Years Experience</div>
                  </div>
                  <div className="bg-green-50 border border-green-100 rounded-xl py-3 px-4">
                    <div className="font-black text-green-700 text-xl">IEC</div>
                    <div className="text-gray-500 text-xs mt-0.5">IS/IEC Certified</div>
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

      {/* 2. CORE VALUES */}
      <section className="py-16 sm:py-24 bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12 sm:mb-16">
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

      {/* 3. MANUFACTURING COMMITMENT */}
      <section className="py-14 sm:py-20 bg-white border-y border-gray-100">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-10">
            <span className="inline-block text-blue-600 font-semibold text-xs tracking-widest uppercase mb-3 border-b-2 border-blue-600 pb-1">How We Build</span>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mt-3">Our Manufacturing Commitment</h2>
          </div>
          <div ref={mfgCommRef} className="ab-stagger grid grid-cols-1 sm:grid-cols-3 gap-6">
            {mfgHighlights.map((m, i) => (
              <div key={i} className="flex gap-5 items-start p-6 bg-gray-50 rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all duration-300">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center">
                  {m.icon}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-base mb-1">{m.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. OUR JOURNEY */}
      <section className="py-16 sm:py-24 bg-gray-50">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-12 sm:mb-16">
            <span className="inline-block text-blue-600 font-semibold text-xs tracking-widest uppercase mb-3 border-b-2 border-blue-600 pb-1">Our Journey</span>
            <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mt-3">How We Got Here</h2>
          </div>
          <div ref={timelineRef} className="ab-stagger relative">
            <div className="hidden lg:block absolute left-0 right-0 h-0.5 bg-gradient-to-r from-blue-100 via-blue-300 to-blue-100" style={{ top: '2rem' }} />
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {milestones.map((m, i) => (
                <div key={i} className="relative flex flex-col items-center text-center">
                  <div className="relative z-10 w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg shadow-blue-200 mb-5 flex-shrink-0">
                    <span className="text-sm font-black">{m.year}</span>
                  </div>
                  <div className="bg-white border border-gray-100 rounded-2xl p-6 w-full hover:border-blue-200 hover:shadow-md transition-all duration-300">
                    <h3 className="font-bold text-gray-900 text-base mb-2">{m.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{m.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6. BECOME A DISTRIBUTOR */}
      <section className="py-14 sm:py-20 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div ref={rangeRef} className="ab-reveal relative bg-gradient-to-br from-[#0f172a] to-[#1e3a8a] rounded-2xl sm:rounded-3xl overflow-hidden p-8 sm:p-12 lg:p-16">
            <div className="absolute -top-16 -right-16 w-72 h-72 bg-blue-500/10 rounded-full" />
            <div className="absolute -bottom-10 -left-10 w-56 h-56 bg-indigo-500/10 rounded-full" />
            <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <span className="inline-block text-blue-400 font-semibold text-xs tracking-widest uppercase mb-4 border-l-4 border-blue-500 pl-3">Partner With Us</span>
                <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight mb-4">
                  Become a GK2<br />Authorised Distributor
                </h2>
                <p className="text-slate-400 text-base leading-relaxed mb-6">
                  We're expanding our distribution network across India. If you're an electrical dealer, contractor, or wholesaler looking for a reliable switchgear brand to stock, we'd love to connect.
                </p>
                <ul className="space-y-2 mb-8">
                  {['Competitive dealer margins', 'Genuine IS/IEC certified products', 'Pan-India logistics support', 'Dedicated sales assistance'].map((pt, i) => (
                    <li key={i} className="flex items-center gap-2 text-slate-300 text-sm">
                      <span className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg viewBox="0 0 16 16" fill="none" stroke="white" strokeWidth="2" className="w-3 h-3"><path d="M3 8l3 3 7-6"/></svg>
                      </span>
                      {pt}
                    </li>
                  ))}
                </ul>
                <div className="flex flex-wrap gap-3">
                  <a href="https://wa.me/918460645021?text=Hello%20GK2%2C%20I%20am%20interested%20in%20becoming%20a%20distributor."
                    target="_blank" rel="noreferrer"
                    className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20bc5a] text-white px-6 py-3 rounded-xl font-semibold transition-colors duration-200 shadow-lg text-sm">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 flex-shrink-0">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.528 5.855L.057 23.882a.5.5 0 0 0 .61.61l6.086-1.461A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 0 1-5.006-1.371l-.36-.214-3.724.894.924-3.638-.235-.374A9.818 9.818 0 1 1 12 21.818z"/>
                    </svg>
                    WhatsApp Us
                  </a>
                  <Link to="/contact" className="inline-flex items-center gap-2 border border-white/30 text-white hover:bg-white/10 px-6 py-3 rounded-xl font-semibold transition-colors duration-200 text-sm">
                    Send Enquiry →
                  </Link>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: '50+', label: 'Active Distributors', icon: '🤝' },
                  { value: 'Pan-India', label: 'Distribution Reach', icon: '🇮🇳' },
                  { value: '12+', label: 'Product Categories', icon: '📦' },
                  { value: '24hr', label: 'Response Time', icon: '⚡' },
                ].map((s, i) => (
                  <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center hover:border-blue-500/40 transition-colors">
                    <div className="text-2xl mb-1">{s.icon}</div>
                    <div className="text-white font-black text-xl">{s.value}</div>
                    <div className="text-slate-400 text-xs mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. CTA */}
      <section className="py-16 sm:py-24 bg-gray-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <div ref={ctaRef} className="ab-reveal relative bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl p-10 sm:p-16 text-center overflow-hidden shadow-2xl shadow-blue-200">
            <div className="absolute -top-16 -right-16 w-64 h-64 bg-white/5 rounded-full" />
            <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-white/5 rounded-full" />
            <div className="absolute top-4 left-4 sm:top-6 sm:left-6">
              <img src={logo} alt="GK2" className="h-8 sm:h-10 w-auto opacity-30" style={{ filter: 'brightness(0) invert(1)' }} />
            </div>
            <div className="relative">
              <h2 className="text-3xl sm:text-4xl font-black text-white mb-4 leading-tight">
                Have a Project in Mind?
              </h2>
              <p className="text-blue-200 text-base sm:text-lg mb-8 sm:mb-10 max-w-xl mx-auto">
                Talk to our team about your electrical protection requirements — residential, commercial, or industrial. We'll help you find the right GK2 solution.
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
