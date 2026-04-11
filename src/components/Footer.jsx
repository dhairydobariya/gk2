import React from 'react'
import { Link } from 'react-router-dom'
import logo from '../assets/logo.png'

function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-800 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-10">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="mb-4">
              <img src={logo} alt="GK2 Switchgear Logo" width="696" height="358" className="h-12 w-auto" style={{ filter: 'brightness(0) invert(1)' }} />
            </div>
            <p className="text-sm leading-relaxed mb-3 text-gray-300">
              IS/IEC certified electrical switchgear manufacturer in Gujarat, India. MCBs, busbars, HRC fuses, changeover switches & more. Made in India.
            </p>
            <div className="flex items-center gap-2 mt-3">
              <span className="text-xs bg-blue-600/20 text-blue-300 border border-blue-600/30 px-2 py-0.5 rounded-full">IEC 60898-1</span>
              <span className="text-xs bg-blue-600/20 text-blue-300 border border-blue-600/30 px-2 py-0.5 rounded-full">IS/IEC 60947-3</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-base font-semibold mb-3 sm:mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { label: 'Home', to: '/' },
                { label: 'About Us', to: '/about' },
                { label: 'All Products', to: '/products' },
                { label: 'Blog', to: '/blog' },
                { label: 'Contact Us', to: '/contact' },
              ].map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-sm text-gray-300 hover:text-white transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Product Categories */}
          <div>
            <h3 className="text-white text-base font-semibold mb-3 sm:mb-4">Products</h3>
            <ul className="space-y-2">
              {[
                { label: 'MCB', to: '/products?category=mcb' },
                { label: 'Busbar', to: '/products?category=busbar' },
                { label: 'HRC Fuse', to: '/products?category=fuse' },
                { label: 'Switch Disconnector Fuse', to: '/products?category=switch-disconnector-fuse' },
                { label: 'Changeover Switch', to: '/products?category=onload-changeover-switch' },
                { label: 'Onload Isolator', to: '/products?category=onload-isolator' },
                { label: 'Reverse Forward Switch', to: '/products?category=reverse-forward' },
              ].map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-sm text-gray-300 hover:text-white transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-white text-base font-semibold mb-3 sm:mb-4">Contact Us</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="mailto:gk2switchgear@gmail.com" className="hover:text-white transition-colors flex items-start gap-2">
                  <span className="mt-0.5">📧</span>
                  <span>gk2switchgear@gmail.com</span>
                </a>
              </li>
              <li>
                <a href="tel:+918460645021" className="hover:text-white transition-colors flex items-start gap-2">
                  <span className="mt-0.5">📞</span>
                  <span>+91 84606 45021</span>
                </a>
              </li>
              <li>
                <a href="https://wa.me/918460645021" target="_blank" rel="noreferrer" className="hover:text-white transition-colors flex items-start gap-2">
                  <span className="mt-0.5">💬</span>
                  <span>WhatsApp Us</span>
                </a>
              </li>
              <li className="flex items-start gap-2 pt-1">
                <span className="mt-0.5">📍</span>
                <span>Plot 1,2,3 Om Textile Park, Kamrej Kadodara Road, Umbhel, Gujarat — 394325</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 mt-6 sm:mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
          <p className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
            <span>&copy; {currentYear}</span>
            <img src={logo} alt="GK2 Switchgear" width="696" height="358" className="h-5 w-auto inline-block" style={{ filter: 'brightness(0) invert(1)' }} />
            <span>All rights reserved.</span>
          </p>
          <p className="text-gray-300 text-xs">Switchgear Manufacturer in India · Gujarat · IS/IEC Certified</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
