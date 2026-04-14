import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import logo from '../assets/logo.png'

function AccordionSection({ title, children }) {
  const [open, setOpen] = useState(false)
  const contentRef = React.useRef(null)

  return (
    <div className="border-b border-gray-700">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between py-4 text-left"
      >
        <span className="text-white text-sm font-semibold">{title}</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
          className={`w-4 h-4 text-gray-400 transition-transform duration-500 ease-in-out ${open ? 'rotate-180' : ''}`}>
          <path d="M6 9l6 6 6-6"/>
        </svg>
      </button>
      <div
        ref={contentRef}
        style={{
          maxHeight: open ? `${contentRef.current?.scrollHeight}px` : '0px',
          opacity: open ? 1 : 0,
          overflow: 'hidden',
          transition: 'max-height 0.45s cubic-bezier(0.4,0,0.2,1), opacity 0.35s ease',
        }}
      >
        <div className="pb-4">{children}</div>
      </div>
    </div>
  )
}

const quickLinks = [
  { label: 'Home', to: '/' },
  { label: 'About Us', to: '/about' },
  { label: 'All Products', to: '/products' },
  { label: 'Blog', to: '/blog' },
  { label: 'Contact Us', to: '/contact' },
]

const productLinks = [
  { label: 'MCB', to: '/products?category=mcb' },
  { label: 'Busbar', to: '/products?category=busbar' },
  { label: 'HRC Fuse', to: '/products?category=fuse' },
  { label: 'Switch Disconnector Fuse', to: '/products?category=switch-disconnector-fuse' },
  { label: 'Changeover Switch', to: '/products?category=onload-changeover-switch' },
  { label: 'Onload Isolator', to: '/products?category=onload-isolator' },
  { label: 'Reverse Forward Switch', to: '/products?category=reverse-forward' },
]

function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-800 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12">

        {/* DESKTOP: 4 columns */}
        <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          <div className="lg:col-span-1">
            <img src={logo} alt="GK2 Switchgear Logo" width="696" height="358"
              className="h-12 w-auto mb-4" style={{ filter: 'brightness(0) invert(1)' }} />
            <p className="text-sm leading-relaxed mb-3 text-gray-300">
              IS/IEC certified electrical switchgear manufacturer in Gujarat, India.
              MCBs, busbars, HRC fuses, changeover switches and more.
            </p>
            <div className="flex items-center gap-2 mt-3">
              <span className="text-xs bg-blue-600/20 text-blue-300 border border-blue-600/30 px-2 py-0.5 rounded-full">IEC 60898-1</span>
              <span className="text-xs bg-blue-600/20 text-blue-300 border border-blue-600/30 px-2 py-0.5 rounded-full">IS/IEC 60947-3</span>
            </div>
          </div>

          <div>
            <h3 className="text-white text-base font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map(l => (
                <li key={l.to}>
                  <Link to={l.to} className="text-sm text-gray-300 hover:text-white transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white text-base font-semibold mb-4">Products</h3>
            <ul className="space-y-2">
              {productLinks.map(l => (
                <li key={l.to}>
                  <Link to={l.to} className="text-sm text-gray-300 hover:text-white transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white text-base font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="mailto:gk2switchgear@gmail.com" className="hover:text-white transition-colors flex items-start gap-2">
                  <span>📧</span><span>gk2switchgear@gmail.com</span>
                </a>
              </li>
              <li>
                <a href="tel:+918460645021" className="hover:text-white transition-colors flex items-start gap-2">
                  <span>📞</span><span>+91 84606 45021</span>
                </a>
              </li>
              <li>
                <a href="https://wa.me/918460645021" target="_blank" rel="noreferrer"
                  className="hover:text-white transition-colors flex items-start gap-2">
                  <span>💬</span><span>WhatsApp Us</span>
                </a>
              </li>
              <li className="flex items-start gap-2 pt-1">
                <span>📍</span>
                <span>Plot 1,2,3 Om Textile Park, Kamrej Kadodara Road, Umbhel, Gujarat — 394325</span>
              </li>
            </ul>
          </div>
        </div>

        {/* MOBILE: accordion */}
        <div className="sm:hidden">
          <div className="pb-5 border-b border-gray-700 mb-1">
            <img src={logo} alt="GK2 Switchgear" width="696" height="358"
              className="h-10 w-auto mb-3" style={{ filter: 'brightness(0) invert(1)' }} />
            <p className="text-xs text-gray-400 leading-relaxed mb-2">
              IS/IEC certified switchgear manufacturer · Gujarat, India
            </p>
            <div className="flex items-center gap-2">
              <span className="text-[10px] bg-blue-600/20 text-blue-300 border border-blue-600/30 px-2 py-0.5 rounded-full">IEC 60898-1</span>
              <span className="text-[10px] bg-blue-600/20 text-blue-300 border border-blue-600/30 px-2 py-0.5 rounded-full">IS/IEC 60947-3</span>
            </div>
          </div>

          <AccordionSection title="Quick Links">
            <ul className="space-y-3">
              {quickLinks.map(l => (
                <li key={l.to}>
                  <Link to={l.to} className="text-sm text-gray-300 hover:text-white transition-colors flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </AccordionSection>

          <AccordionSection title="Products">
            <ul className="space-y-3">
              {productLinks.map(l => (
                <li key={l.to}>
                  <Link to={l.to} className="text-sm text-gray-300 hover:text-white transition-colors flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </AccordionSection>

          <AccordionSection title="Contact Us">
            <ul className="space-y-3 text-sm">
              <li>
                <a href="mailto:gk2switchgear@gmail.com" className="hover:text-white transition-colors flex items-center gap-2">
                  <span>📧</span><span>gk2switchgear@gmail.com</span>
                </a>
              </li>
              <li>
                <a href="tel:+918460645021" className="hover:text-white transition-colors flex items-center gap-2">
                  <span>📞</span><span>+91 84606 45021</span>
                </a>
              </li>
              <li>
                <a href="https://wa.me/918460645021" target="_blank" rel="noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-2">
                  <span>💬</span><span>WhatsApp Us</span>
                </a>
              </li>
              <li className="flex items-start gap-2">
                <span>📍</span>
                <span>Plot 1,2,3 Om Textile Park, Kamrej Kadodara Road, Umbhel, Gujarat — 394325</span>
              </li>
            </ul>
          </AccordionSection>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 mt-6 pt-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm">
          <p className="flex items-center gap-2 flex-wrap justify-center sm:justify-start text-gray-300">
            <span>&copy; {currentYear}</span>
            <img src={logo} alt="GK2 Switchgear" width="696" height="358"
              className="h-5 w-auto inline-block" style={{ filter: 'brightness(0) invert(1)' }} />
            <span>All rights reserved.</span>
          </p>
          <p className="text-gray-300 text-xs">Switchgear Manufacturer in India · Gujarat · IS/IEC Certified</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
