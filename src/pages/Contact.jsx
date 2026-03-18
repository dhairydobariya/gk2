import { useState, useEffect, useRef } from 'react';
import DynamicBanner from '../components/DynamicBanner';

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
    label: 'Email Us',
    value: 'gk2switchgear@gmail.com',
    sub: 'We reply within 24 hours',
    href: 'mailto:gk2switchgear@gmail.com',
    bg: 'bg-blue-50',
    border: 'border-blue-100',
    iconBg: 'bg-blue-600',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5">
        <rect x="2" y="4" width="20" height="16" rx="2"/>
        <path d="M2 7l10 7 10-7"/>
      </svg>
    ),
  },
  {
    label: 'Call Us',
    value: '+91 98765 43210',
    sub: 'Mon–Sat, 9 AM – 6 PM',
    href: 'tel:+919876543210',
    bg: 'bg-green-50',
    border: 'border-green-100',
    iconBg: 'bg-green-600',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 11.39 19a19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
      </svg>
    ),
  },
  {
    label: 'Visit Us',
    value: 'Industrial Area, Gujarat',
    sub: 'India — 380001',
    href: 'https://maps.google.com',
    bg: 'bg-indigo-50',
    border: 'border-indigo-100',
    iconBg: 'bg-indigo-600',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5">
        <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/>
        <circle cx="12" cy="10" r="3"/>
      </svg>
    ),
  },
];

const hours = [
  { day: 'Monday – Friday', time: '9:00 AM – 6:00 PM', open: true },
  { day: 'Saturday',        time: '9:00 AM – 2:00 PM', open: true },
  { day: 'Sunday',          time: 'Closed',             open: false },
];

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);

  const cardsRef  = useReveal();
  const formRef   = useReveal();
  const mapRef    = useReveal();

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const handleSubmit = e => {
    e.preventDefault();
    setSent(true);
    setForm({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <style>{`
        .ct-reveal { opacity:0; transform:translateY(28px); transition:opacity 0.65s ease,transform 0.65s ease; }
        .ct-reveal.ct-vis { opacity:1; transform:translateY(0); }
        .ct-stagger > * { opacity:0; transform:translateY(20px); transition:opacity 0.5s ease,transform 0.5s ease; }
        .ct-stagger.ct-vis > *:nth-child(1){opacity:1;transform:translateY(0);transition-delay:0ms}
        .ct-stagger.ct-vis > *:nth-child(2){opacity:1;transform:translateY(0);transition-delay:100ms}
        .ct-stagger.ct-vis > *:nth-child(3){opacity:1;transform:translateY(0);transition-delay:200ms}
        .ct-input { width:100%; border:1.5px solid #e5e7eb; border-radius:0.75rem; padding:0.75rem 1rem; font-size:0.95rem; color:#111827; background:#fff; outline:none; transition:border-color 0.2s,box-shadow 0.2s; }
        .ct-input:focus { border-color:#2563eb; box-shadow:0 0 0 3px rgba(37,99,235,0.1); }
        .ct-input::placeholder { color:#9ca3af; }
      `}</style>

      <DynamicBanner page="contact" compact />

      {/* ── CONTACT CARDS ── */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-5xl">
          <div ref={cardsRef} className="ct-stagger grid grid-cols-1 sm:grid-cols-3 gap-5">
            {contactCards.map((c, i) => (
              <a key={i} href={c.href} target={c.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer"
                className={`group flex items-center gap-4 p-6 rounded-2xl border ${c.border} ${c.bg} hover:shadow-md hover:-translate-y-1 transition-all duration-300`}>
                <div className={`flex-shrink-0 w-12 h-12 ${c.iconBg} text-white rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                  {c.icon}
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-0.5">{c.label}</p>
                  <p className="font-bold text-gray-900 text-sm leading-snug">{c.value}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{c.sub}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── FORM + HOURS ── */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div ref={formRef} className="ct-reveal grid grid-cols-1 lg:grid-cols-3 gap-10">

            {/* Contact Form — takes 2 cols */}
            <div className="lg:col-span-2">
              <span className="inline-block text-blue-600 font-semibold text-xs tracking-widest uppercase mb-3 border-l-4 border-blue-600 pl-3">Send a Message</span>
              <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-8">We'd Love to Hear From You</h2>

              {sent ? (
                <div className="flex flex-col items-center justify-center py-16 text-center bg-green-50 border border-green-100 rounded-2xl">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <svg viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" className="w-8 h-8">
                      <path d="M20 6L9 17l-5-5"/>
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Message Sent!</h3>
                  <p className="text-gray-500 text-sm max-w-xs">Thank you for reaching out. Our team will get back to you within 24 hours.</p>
                  <button onClick={() => setSent(false)} className="mt-6 text-blue-600 font-semibold text-sm hover:underline">Send another message</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name <span className="text-red-500">*</span></label>
                      <input name="name" value={form.name} onChange={handleChange} required placeholder="Your full name" className="ct-input" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address <span className="text-red-500">*</span></label>
                      <input name="email" type="email" value={form.email} onChange={handleChange} required placeholder="you@example.com" className="ct-input" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone Number</label>
                      <input name="phone" value={form.phone} onChange={handleChange} placeholder="+91 98765 43210" className="ct-input" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Subject <span className="text-red-500">*</span></label>
                      <select name="subject" value={form.subject} onChange={handleChange} required className="ct-input">
                        <option value="">Select a subject</option>
                        <option>Product Inquiry</option>
                        <option>Technical Support</option>
                        <option>Distributor Partnership</option>
                        <option>Bulk Order</option>
                        <option>Other</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Message <span className="text-red-500">*</span></label>
                    <textarea name="message" value={form.message} onChange={handleChange} required rows={5} placeholder="Tell us how we can help you..." className="ct-input resize-none" />
                  </div>
                  <button type="submit"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-10 py-3.5 rounded-xl font-bold transition-all duration-200 shadow-lg shadow-blue-200 hover:shadow-blue-300 hover:-translate-y-0.5">
                    Send Message
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                      <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z"/>
                    </svg>
                  </button>
                </form>
              )}
            </div>

            {/* Business Hours sidebar */}
            <div className="flex flex-col gap-6">
              <div className="bg-gray-50 border border-gray-100 rounded-2xl p-7">
                <h3 className="font-bold text-gray-900 text-lg mb-5 flex items-center gap-2">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="1.8" className="w-5 h-5">
                    <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
                  </svg>
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

              {/* Quick links */}
              <div className="bg-[#0f172a] rounded-2xl p-7 text-white">
                <h3 className="font-bold text-white text-base mb-4">Quick Links</h3>
                <div className="space-y-2.5">
                  {[
                    { label: 'Browse Products', href: '/products' },
                    { label: 'Find Distributors', href: '/distributors' },
                    { label: 'About GK2', href: '/about' },
                  ].map((l, i) => (
                    <a key={i} href={l.href}
                      className="flex items-center justify-between py-2 border-b border-white/10 last:border-0 text-slate-300 hover:text-white transition-colors text-sm group">
                      {l.label}
                      <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── MAP SECTION ── */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <div ref={mapRef} className="ct-reveal">
            <div className="text-center mb-10">
              <span className="inline-block text-blue-600 font-semibold text-xs tracking-widest uppercase mb-3 border-b-2 border-blue-600 pb-1">Find Us</span>
              <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mt-3">Our Location</h2>
              <p className="text-gray-500 mt-3 max-w-md mx-auto text-sm">Visit our manufacturing facility or reach out before you come.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
              {/* Address card */}
              <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white mb-5">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6">
                      <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/>
                      <circle cx="12" cy="10" r="3"/>
                    </svg>
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg mb-3">GK2 Manufacturing Unit</h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-6">
                    Industrial Area, GIDC<br />
                    Ahmedabad, Gujarat<br />
                    India — 380 001
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <svg viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="1.8" className="w-4 h-4 flex-shrink-0">
                        <rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 7l10 7 10-7"/>
                      </svg>
                      gk2switchgear@gmail.com
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <svg viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="1.8" className="w-4 h-4 flex-shrink-0">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 11.39 19a19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                      </svg>
                      +91 98765 43210
                    </div>
                  </div>
                </div>
                <a href="https://maps.google.com/?q=Ahmedabad+GIDC+Industrial+Area" target="_blank" rel="noreferrer"
                  className="mt-8 inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-semibold text-sm transition-all duration-200">
                  Open in Google Maps →
                </a>
              </div>

              {/* Embedded map — 2 cols */}
              <div className="lg:col-span-2 rounded-2xl overflow-hidden border border-gray-100 shadow-sm min-h-[360px]">
                <iframe
                  title="GK2 Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3671.9!2d72.5714!3d23.0225!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e848aba5bd449%3A0x4fcedd11614f6516!2sGIDC%20Industrial%20Estate%2C%20Ahmedabad%2C%20Gujarat!5e0!3m2!1sen!2sin!4v1700000000000"
                  width="100%"
                  height="100%"
                  style={{ border: 0, minHeight: '360px', display: 'block' }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
