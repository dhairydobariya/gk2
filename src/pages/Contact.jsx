import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import DynamicBanner from '../components/DynamicBanner';
import useSEO from '../hooks/useSEO';
import QuoteModal from '../components/QuoteModal';

function useReveal(threshold = 0.12) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add('ct-vis'); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

const contactCards = [
  {
    label: 'Email Us', value: 'gk2switchgear@gmail.com', sub: 'We reply within 24 hours',
    href: 'mailto:gk2switchgear@gmail.com',
    bg: 'bg-blue-50', border: 'border-blue-100', iconBg: 'bg-blue-600',
    icon: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 7l10 7 10-7"/></svg>),
  },
  {
    label: 'Call Us', value: '+91 84606 45021', sub: 'Mon–Sat, 9 AM – 6 PM',
    href: 'tel:+918460645021',
    bg: 'bg-green-50', border: 'border-green-100', iconBg: 'bg-green-600',
    icon: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 11.39 19a19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>),
  },
  {
    label: 'WhatsApp', value: '+91 84606 45021', sub: 'Quick response guaranteed',
    href: 'https://wa.me/918460645021?text=Hello%20GK2%2C%20I%20would%20like%20to%20enquire%20about%20your%20products.',
    bg: 'bg-emerald-50', border: 'border-emerald-100', iconBg: 'bg-[#25D366]',
    icon: (<svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.528 5.855L.057 23.882a.5.5 0 0 0 .61.61l6.086-1.461A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 0 1-5.006-1.371l-.36-.214-3.724.894.924-3.638-.235-.374A9.818 9.818 0 1 1 12 21.818z"/></svg>),
  },
  {
    label: 'Visit Us', value: 'Plot 1,2,3 Om Textile Park, Umbhel', sub: 'Kamrej Kadodara Road — 394325',
    href: 'https://maps.google.com/?q=Umbhel+Kamrej+Kadodara+Road+394325',
    bg: 'bg-indigo-50', border: 'border-indigo-100', iconBg: 'bg-indigo-600',
    icon: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>),
  },
];

const hours = [
  { day: 'Monday – Friday', time: '9:00 AM – 6:00 PM', open: true },
  { day: 'Saturday',        time: '9:00 AM – 6:00 PM', open: true },
  { day: 'Sunday',          time: 'Closed',             open: false },
];

const trustPoints = [
  { icon: '⚡', label: 'Reply within 24 hours' },
  { icon: '🤝', label: 'Dedicated sales team' },
  { icon: '🇮🇳', label: 'Pan-India support' },
];

export default function Contact() {
  useSEO({
    title: 'Contact GK2 Switchgear | Get a Quote | Umbhel, Gujarat',
    description: 'Contact GK2 Switchgear for product enquiries, bulk orders and pricing. Call +91 84606 45021 or WhatsApp us. Located at Om Textile Park, Umbhel, Gujarat — 394325.',
    canonical: '/contact',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'ContactPage',
      name: 'Contact GK2 Switchgear',
      url: 'https://gk2switchgear.com/contact',
    }
  });
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [sent, setSent] = useState(false);

  const cardsRef = useReveal();
  const trustRef = useReveal();
  const formRef  = useReveal();
  const mapRef   = useReveal();

  const handleChange = e => setForm ? null : null; // unused, kept for safety

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <style>{`
        .ct-reveal { opacity:0; transform:translateY(28px); transition:opacity 0.65s ease,transform 0.65s ease; }
        .ct-reveal.ct-vis { opacity:1; transform:translateY(0); }
        .ct-stagger > * { opacity:0; transform:translateY(20px); transition:opacity 0.5s ease,transform 0.5s ease; }
        .ct-stagger.ct-vis > *:nth-child(1){opacity:1;transform:translateY(0);transition-delay:0ms}
        .ct-stagger.ct-vis > *:nth-child(2){opacity:1;transform:translateY(0);transition-delay:80ms}
        .ct-stagger.ct-vis > *:nth-child(3){opacity:1;transform:translateY(0);transition-delay:160ms}
        .ct-stagger.ct-vis > *:nth-child(4){opacity:1;transform:translateY(0);transition-delay:240ms}
        .ct-input { width:100%; border:1.5px solid #e5e7eb; border-radius:0.75rem; padding:0.75rem 1rem; font-size:0.95rem; color:#111827; background:#fff; outline:none; transition:border-color 0.2s,box-shadow 0.2s; }
        .ct-input:focus { border-color:#2563eb; box-shadow:0 0 0 3px rgba(37,99,235,0.1); }
        .ct-input::placeholder { color:#9ca3af; }
      `}</style>

      <DynamicBanner page="contact" compact />

      {/* CONTACT CARDS */}
      <section className="py-12 sm:py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div ref={cardsRef} className="ct-stagger grid grid-cols-2 sm:grid-cols-4 gap-4">
            {contactCards.map((c, i) => (
              <a key={i} href={c.href} target={c.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer"
                className={`group flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 px-4 py-4 sm:px-6 sm:py-6 rounded-2xl border ${c.border} ${c.bg} hover:shadow-md hover:-translate-y-1 transition-all duration-300`}>
                <div className={`flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 ${c.iconBg} text-white rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                  {c.icon}
                </div>
                <div className="min-w-0 w-full">
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-0.5">{c.label}</p>
                  <p className="font-bold text-gray-900 text-[11px] sm:text-sm leading-snug break-all">{c.value}</p>
                  <p className="text-xs text-gray-400 mt-0.5 hidden sm:block">{c.sub}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <div className="bg-white border-y border-gray-100 py-4">
        <div ref={trustRef} className="ct-stagger container mx-auto px-4 max-w-5xl flex flex-wrap items-center justify-center gap-x-10 gap-y-2">
          {trustPoints.map((t, i) => (
            <div key={i} className="flex items-center gap-2 text-sm text-gray-600 font-medium">
              <span className="text-base">{t.icon}</span>
              <span>{t.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* FORM + SIDEBAR */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div ref={formRef} className="ct-reveal grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <span className="inline-block text-blue-600 font-semibold text-xs tracking-widest uppercase mb-3 border-l-4 border-blue-600 pl-3">Send a Message</span>
              <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4">We'd Love to Hear From You</h2>
              <p className="text-gray-500 text-sm mb-8">Fill in your details and the products you need — we'll get back to you on WhatsApp within 24 hours.</p>

              {sent ? (
                <div className="flex flex-col items-center justify-center py-16 text-center bg-green-50 border border-green-100 rounded-2xl">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <svg viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" className="w-8 h-8"><path d="M20 6L9 17l-5-5"/></svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Enquiry Sent!</h3>
                  <p className="text-gray-500 text-sm max-w-xs">Your WhatsApp should have opened with your enquiry. Our team will reply within 24 hours.</p>
                  <button onClick={() => setSent(false)} className="mt-6 text-blue-600 font-semibold text-sm hover:underline">Send another enquiry</button>
                </div>
              ) : (
                <div>
                  <button
                    type="button"
                    onClick={() => setQuoteOpen(true)}
                    className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-2xl font-bold text-base transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 mb-4"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                      <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/>
                      <rect x="9" y="3" width="6" height="4" rx="1"/>
                      <path d="M9 12h6M9 16h4"/>
                    </svg>
                    Open Product Enquiry Form
                  </button>
                  <p className="text-center text-xs text-gray-400">Select multiple products, ratings, and quantities — sends via WhatsApp</p>

                  <div className="mt-8 pt-8 border-t border-gray-100">
                    <p className="text-sm font-semibold text-gray-700 mb-4">Or reach us directly:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <a href="https://wa.me/918460645021?text=Hello%20GK2%2C%20I%20would%20like%20to%20enquire%20about%20your%20products."
                        target="_blank" rel="noreferrer"
                        className="flex items-center gap-3 p-4 bg-[#25D366]/10 border border-[#25D366]/30 rounded-xl hover:bg-[#25D366]/20 transition-colors group">
                        <div className="w-10 h-10 bg-[#25D366] rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                          <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.528 5.855L.057 23.882a.5.5 0 0 0 .61.61l6.086-1.461A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 0 1-5.006-1.371l-.36-.214-3.724.894.924-3.638-.235-.374A9.818 9.818 0 1 1 12 21.818z"/></svg>
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 text-sm">WhatsApp</p>
                          <p className="text-xs text-gray-500">+91 84606 45021</p>
                        </div>
                      </a>
                      <a href="tel:+918460645021"
                        className="flex items-center gap-3 p-4 bg-green-50 border border-green-100 rounded-xl hover:bg-green-100 transition-colors group">
                        <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="w-5 h-5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 11.39 19a19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 text-sm">Call Us</p>
                          <p className="text-xs text-gray-500">Mon–Sat, 9AM–6PM</p>
                        </div>
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="flex flex-col gap-6">
              {/* Business Hours */}
              <div className="bg-gray-50 border border-gray-100 rounded-2xl p-7">
                <h3 className="font-bold text-gray-900 text-lg mb-5 flex items-center gap-2">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="1.8" className="w-5 h-5"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                  Business Hours
                </h3>
                <div className="space-y-3">
                  {hours.map((h, i) => (
                    <div key={i} className="flex items-center justify-between py-2.5 border-b border-gray-100 last:border-0">
                      <span className="text-sm text-gray-600 font-medium">{h.day}</span>
                      <span className={`text-sm font-semibold ${h.open ? 'text-gray-900' : 'text-red-400'}`}>{h.time}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-5 p-4 bg-blue-50 border border-blue-100 rounded-xl">
                  <p className="text-xs text-blue-700 leading-relaxed">
                    For urgent inquiries outside business hours, email us at <span className="font-semibold">gk2switchgear@gmail.com</span> and we'll respond as soon as possible.
                  </p>
                </div>
              </div>

              {/* Quick Links */}
              <div className="bg-[#0f172a] rounded-2xl p-7 text-white">
                <h3 className="font-bold text-white text-base mb-4">Quick Links</h3>
                <div className="space-y-2.5">
                  {[
                    { label: 'Browse Products', to: '/products' },
                    { label: 'About GK2', to: '/about' },
                  ].map((l, i) => (
                    <Link key={i} to={l.to} className="flex items-center justify-between py-2 border-b border-white/10 last:border-0 text-slate-300 hover:text-white transition-colors text-sm group">
                      {l.label}
                      <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* WhatsApp CTA */}
              <a href="https://wa.me/918460645021?text=Hello%20GK2%2C%20I%20would%20like%20to%20enquire%20about%20your%20products."
                target="_blank" rel="noreferrer"
                className="flex items-center gap-4 p-5 bg-[#25D366] hover:bg-[#20bc5a] rounded-2xl transition-colors duration-200 group">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <svg viewBox="0 0 24 24" fill="white" className="w-6 h-6"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.528 5.855L.057 23.882a.5.5 0 0 0 .61.61l6.086-1.461A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 0 1-5.006-1.371l-.36-.214-3.724.894.924-3.638-.235-.374A9.818 9.818 0 1 1 12 21.818z"/></svg>
                </div>
                <div>
                  <p className="text-white font-bold text-sm">Chat on WhatsApp</p>
                  <p className="text-white/80 text-xs mt-0.5">Fastest way to reach us</p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* MAP SECTION */}
      <section className="bg-gray-50 py-16 sm:py-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <div ref={mapRef} className="ct-reveal">
            <div className="text-center mb-10">
              <span className="inline-block text-blue-600 font-semibold text-xs tracking-widest uppercase mb-3 border-b-2 border-blue-600 pb-1">Find Us</span>
              <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mt-3">Our Location</h2>
              <p className="text-gray-500 mt-3 max-w-md mx-auto text-sm">Visit our manufacturing facility or reach out before you come.</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
              <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white mb-5">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg mb-3">GK2 Manufacturing Unit</h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-6">
                    Plot 1,2,3 Om Textile Park<br />13, Kamrej Kadodara Road<br />Umbhel, Gujarat — 394325
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <svg viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="1.8" className="w-4 h-4 flex-shrink-0"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 7l10 7 10-7"/></svg>
                      gk2switchgear@gmail.com
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <svg viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="1.8" className="w-4 h-4 flex-shrink-0"><path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 11.39 19a19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                      +91 84606 45021
                    </div>
                  </div>
                </div>
                <a 
                  href="https://maps.app.goo.gl/F69GTFWiuSvP3pGG9"
                  target="_blank"
                  rel="noreferrer"
                  className="mt-8 inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-semibold text-sm transition-all duration-200"
                >
                  Open in Google Maps →
                </a>
              </div>
              <div className="lg:col-span-2 rounded-2xl overflow-hidden border border-gray-100 shadow-sm min-h-[360px]">
                <iframe
                  title="GK2 Location"
                  src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d1031.1445770933287!2d72.99637323974541!3d21.18292290044955!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMjHCsDExJzAxLjEiTiA3MsKwNTknNDcuNiJF!5e1!3m2!1sen!2sin!4v1775306508432!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0, minHeight: "360px", display: 'block' }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* QUOTE MODAL */}
      <QuoteModal isOpen={quoteOpen} onClose={() => setQuoteOpen(false)} />
    </div>
  );
}
