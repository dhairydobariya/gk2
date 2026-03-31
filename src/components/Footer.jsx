import React from 'react'
import { Link } from 'react-router-dom'
import logo from '../assets/logo.png'

function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-800 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
          {/* Company Info */}
          <div>
            <div className="mb-4">
              <img 
                src={logo} 
                alt="GK2 Logo" 
                className="h-12 w-auto"
                style={{
                  filter: 'brightness(0) invert(1)'
                }}
              />
            </div>
            <p className="text-sm">
              Professional manufacturer of electrical switchgear products, MCBs, and bus bars for industrial and commercial applications.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-base sm:text-lg font-semibold mb-3 sm:mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-sm hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-sm hover:text-white transition-colors">
                  Products
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-white text-base sm:text-lg font-semibold mb-3 sm:mb-4">Contact Us</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <span className="font-medium">Email:</span>{' '}
                <a href="mailto:gk2switchgear@gmail.com" className="hover:text-white transition-colors">
                  gk2switchgear@gmail.com
                </a>
              </li>
              <li>
                <span className="font-medium">Phone:</span>{' '}
                <a href="tel:+918460645021" className="hover:text-white transition-colors">
                  +91 84606 45021
                </a>
              </li>
              <li>
                <span className="font-medium">Address:</span> Plot 1,2,3 Om Textile Park, 13, Kamrej Kadodara Road, Umbhel — 394325
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 mt-6 sm:mt-8 pt-6 text-center text-sm">
          <p className="flex items-center justify-center gap-2 flex-wrap">
            <span>&copy; {currentYear}</span>
            <img 
              src={logo} 
              alt="GK2 Logo" 
              className="h-5 w-auto inline-block"
              style={{
                filter: 'brightness(0) invert(1)'
              }}
            />
            <span>All rights reserved.</span>
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
