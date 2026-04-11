import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/logo.png';
import useSEO from '../hooks/useSEO';

export default function NotFound() {
  const { pathname } = useLocation();

  useSEO({
    title: 'Page Not Found | GK2 Switchgear',
    description: 'The page you are looking for does not exist. Browse GK2 Switchgear products — MCBs, busbars, HRC fuses, changeover switches. IS/IEC certified manufacturer, Gujarat, India.',
  });

  return (
    <div className="min-h-screen bg-[#0a0f1e] flex flex-col items-center justify-center relative overflow-hidden px-4">

      {/* Subtle grid */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.6) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.6) 1px,transparent 1px)', backgroundSize: '60px 60px' }} />

      {/* Glow blobs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Logo — top left */}
      <div className="absolute top-6 left-8 z-10">
        <Link to="/">
          <img src={logo} alt="GK2" width="696" height="358" className="h-7 w-auto" style={{ filter: 'brightness(0) invert(1)' }} />
        </Link>
      </div>

      {/* Card */}
      <div className="relative z-10 w-full max-w-md bg-white/[0.04] border border-white/[0.08] rounded-2xl p-10 text-center shadow-2xl shadow-black/40 backdrop-blur-sm">

        {/* 404 number */}
        <div className="text-[80px] font-black leading-none tracking-tighter text-white mb-1">
          404
        </div>

        {/* Divider */}
        <div className="h-px w-16 bg-blue-500/60 mx-auto mb-5" />

        {/* Title */}
        <h1 className="text-xl font-bold text-white mb-2">Page Not Found</h1>

        {/* Description */}
        <p className="text-slate-400 text-sm leading-relaxed mb-5">
          The page you're looking for doesn't exist or may have been moved.
        </p>

        {/* Bad URL badge */}
        {pathname && pathname !== '/' && (
          <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-1.5 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
            <code className="text-red-400 text-xs font-mono">{pathname}</code>
          </div>
        )}

        {/* Primary CTA */}
        <Link to="/"
          className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200 shadow-lg shadow-blue-900/30 mb-3">
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
          </svg>
          Back to Home
        </Link>

        {/* Secondary CTAs */}
        <div className="flex gap-2">
          <Link to="/products"
            className="flex-1 flex items-center justify-center gap-1.5 bg-white/[0.05] hover:bg-white/[0.09] border border-white/10 text-slate-300 hover:text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200">
            Products
          </Link>
          <Link to="/contact"
            className="flex-1 flex items-center justify-center gap-1.5 bg-white/[0.05] hover:bg-white/[0.09] border border-white/10 text-slate-300 hover:text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200">
            Contact
          </Link>
        </div>

        {/* Footer note */}
        <p className="text-slate-600 text-xs mt-6">© {new Date().getFullYear()} GK2 Switchgear</p>
      </div>
    </div>
  );
}
