import React, { useState, useEffect, useRef } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import logo from '../assets/logo.png'
import { getProducts } from '../utils/dataManager'
import ImageWithFallback from './ImageWithFallback'

function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [menuHeight, setMenuHeight] = useState(0)
  const menuRef = useRef(null)
  const navRef = useRef(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [showResults, setShowResults] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [allProducts, setAllProducts] = useState([])
  const searchRef = useRef(null)
  const navigate = useNavigate()

  // Load products on mount
  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = () => {
    const productsData = getProducts()
    setAllProducts(productsData || [])
  }

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false)
        setSelectedIndex(-1)
      }
      // Close mobile menu when clicking outside nav
      if (navRef.current && !navRef.current.contains(event.target)) {
        setMobileMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Search products
  useEffect(() => {
    if (searchQuery.trim().length > 0 && allProducts.length > 0) {
      const filtered = allProducts.filter(product =>
        product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.series?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.breakingCapacity?.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
      
      setSearchResults(filtered)
      setShowResults(true)
      setSelectedIndex(-1) // Reset selection when results change
    } else {
      setSearchResults([])
      setShowResults(false)
      setSelectedIndex(-1)
    }
  }, [searchQuery, allProducts])

  const handleProductClick = (productId) => {
    navigate(`/products/${productId}`)
    setSearchQuery('')
    setShowResults(false)
    setSelectedIndex(-1)
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchResults.length > 0) {
      const targetIndex = selectedIndex >= 0 ? selectedIndex : 0
      navigate(`/products/${searchResults[targetIndex].id}`)
      setSearchQuery('')
      setShowResults(false)
      setSelectedIndex(-1)
    }
  }

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (!showResults || searchResults.length === 0) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev => 
          prev < searchResults.length - 1 ? prev + 1 : prev
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1)
        break
      case 'Escape':
        setShowResults(false)
        setSelectedIndex(-1)
        break
      case 'Enter':
        e.preventDefault()
        if (selectedIndex >= 0 && searchResults[selectedIndex]) {
          handleProductClick(searchResults[selectedIndex].id)
        } else if (searchResults.length > 0) {
          handleProductClick(searchResults[0].id)
        }
        break
      default:
        break
    }
  }

  const toggleMobileMenu = () => {
    if (!mobileMenuOpen && menuRef.current) {
      setMenuHeight(menuRef.current.scrollHeight)
    }
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const navLinkClasses = ({ isActive }) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive
        ? 'bg-blue-700 text-white'
        : 'text-gray-300 hover:bg-blue-600 hover:text-white'
    }`

  const mobileNavLinkClasses = ({ isActive }) =>
    `block px-3 py-2 rounded-md text-base font-medium ${
      isActive
        ? 'bg-blue-700 text-white'
        : 'text-gray-300 hover:bg-blue-600 hover:text-white'
    }`

  return (
    <header className="bg-blue-800 shadow-lg" ref={navRef}>
      <nav className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16 gap-4">
          {/* Logo/Company Name */}
          <div className="flex-shrink-0">
            <NavLink to="/" className="flex items-center hover:opacity-80 transition-opacity">
              <img 
                src={logo} 
                alt="GK2 Logo" 
                className="h-10 sm:h-12 w-auto"
                style={{
                  filter: 'brightness(0) invert(1)'
                }}
              />
            </NavLink>
          </div>

          {/* Global Search Bar */}
          <div className="hidden md:block flex-1 max-w-md relative" ref={searchRef}>
            <form onSubmit={handleSearchSubmit}>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Search products..."
                  className="w-full px-4 py-2 pl-10 rounded-lg bg-blue-700 text-white placeholder-blue-200 border border-blue-600 focus:outline-none focus:ring-2 focus:ring-white focus:bg-blue-600"
                />
                <svg
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-blue-200"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </form>

            {/* Search Results Dropdown */}
            {showResults && searchResults.length > 0 && (
              <div className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-96 overflow-y-auto">
                {searchResults.map((product, index) => (
                  <button
                    key={product.id}
                    onClick={() => handleProductClick(product.id)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`w-full flex items-center gap-3 p-3 transition-colors border-b border-gray-100 last:border-b-0 text-left ${
                      selectedIndex === index
                        ? 'bg-blue-50 border-l-4 border-l-blue-600'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="w-12 h-12 flex-shrink-0">
                      <ImageWithFallback
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-contain bg-gray-50 rounded"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={`font-medium truncate ${
                        selectedIndex === index ? 'text-blue-900' : 'text-gray-900'
                      }`}>
                        {product.name}
                      </div>
                      <div className="text-sm text-gray-500 flex gap-2">
                        <span>{product.series}</span>
                        <span>•</span>
                        <span>{product.breakingCapacity}</span>
                      </div>
                    </div>
                    <svg 
                      className={`w-5 h-5 ${
                        selectedIndex === index ? 'text-blue-600' : 'text-gray-400'
                      }`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                ))}
                
                {/* Keyboard hint */}
                <div className="px-3 py-2 bg-gray-50 border-t border-gray-200 text-xs text-gray-500 flex items-center justify-center gap-4">
                  <span className="flex items-center gap-1">
                    <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs">↑</kbd>
                    <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs">↓</kbd>
                    <span>Navigate</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs">Enter</kbd>
                    <span>Select</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs">Esc</kbd>
                    <span>Close</span>
                  </span>
                </div>
              </div>
            )}

            {showResults && searchQuery && searchResults.length === 0 && (
              <div className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-xl border border-gray-200 z-50 p-4 text-center text-gray-500">
                No products found
              </div>
            )}
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:space-x-4">
            <NavLink to="/" className={navLinkClasses}>
              Home
            </NavLink>
            <NavLink to="/about" className={navLinkClasses}>
              About Us
            </NavLink>
            <NavLink to="/products" className={navLinkClasses}>
              Products
            </NavLink>
            <NavLink to="/blog" className={navLinkClasses}>
              Blog
            </NavLink>
            <NavLink to="/contact" className={navLinkClasses}>
              Contact Us
            </NavLink>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="text-gray-300 hover:text-white focus:outline-none p-2"
              aria-label="Toggle menu"
            >
              <div className="relative w-5 h-4">
                <span className={`absolute left-0 w-5 h-[1.5px] bg-current rounded-full transition-all duration-600 ease-in-out ${mobileMenuOpen ? 'rotate-45 top-[7px]' : 'top-0'}`} style={{transitionDuration:'0.6s'}} />
                <span className={`absolute left-0 top-[7px] w-5 h-[1.5px] bg-current rounded-full transition-all ease-in-out ${mobileMenuOpen ? 'opacity-0 scale-x-0' : 'opacity-100 scale-x-100'}`} style={{transitionDuration:'0.4s'}} />
                <span className={`absolute left-0 w-5 h-[1.5px] bg-current rounded-full transition-all ease-in-out ${mobileMenuOpen ? '-rotate-45 top-[7px]' : 'top-[14px]'}`} style={{transitionDuration:'0.6s'}} />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu — animated slide down */}
        <div
          className="md:hidden overflow-hidden"
          style={{
            maxHeight: mobileMenuOpen ? `${menuHeight}px` : '0px',
            opacity: mobileMenuOpen ? 1 : 0,
            transform: mobileMenuOpen ? 'translateY(0)' : 'translateY(-10px)',
            transition: 'max-height 0.75s cubic-bezier(0.4,0,0.2,1), opacity 0.6s ease, transform 0.6s ease',
          }}
        >
          <div ref={menuRef} className="pb-3 pt-2 space-y-1">
            {/* Mobile Search */}
            <div className="px-3 pb-3" ref={searchRef}>
              <form onSubmit={handleSearchSubmit}>
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Search products..."
                    className="w-full px-4 py-2 pl-10 rounded-lg bg-blue-700 text-white placeholder-blue-200 border border-blue-600 focus:outline-none focus:ring-2 focus:ring-white"
                  />
                  <svg
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-blue-200"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </form>
              {/* Mobile Search Results */}
              {showResults && searchResults.length > 0 && (
                <div className="mt-2 w-full bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-72 overflow-y-auto">
                  {searchResults.map((product, index) => (
                    <button
                      key={product.id}
                      onClick={() => { handleProductClick(product.id); setMobileMenuOpen(false); }}
                      className="w-full flex items-center gap-3 p-3 transition-colors border-b border-gray-100 last:border-b-0 text-left hover:bg-gray-50"
                    >
                      <div className="w-10 h-10 flex-shrink-0 bg-gray-50 rounded overflow-hidden">
                        <ImageWithFallback src={product.image} alt={product.name} className="w-full h-full object-contain" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 truncate text-sm">{product.name}</div>
                        <div className="text-xs text-gray-500">{product.series}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
              {showResults && searchQuery && searchResults.length === 0 && (
                <div className="mt-2 w-full bg-white rounded-lg shadow-xl border border-gray-200 p-4 text-center text-gray-500 text-sm">
                  No products found
                </div>
              )}
            </div>

            <NavLink to="/" className={mobileNavLinkClasses} onClick={toggleMobileMenu}>
              Home
            </NavLink>
            <NavLink to="/about" className={mobileNavLinkClasses} onClick={toggleMobileMenu}>
              About Us
            </NavLink>
            <NavLink to="/products" className={mobileNavLinkClasses} onClick={toggleMobileMenu}>
              Products
            </NavLink>
            <NavLink to="/blog" className={mobileNavLinkClasses} onClick={toggleMobileMenu}>
              Blog
            </NavLink>
            <NavLink to="/contact" className={mobileNavLinkClasses} onClick={toggleMobileMenu}>
              Contact Us
            </NavLink>
          </div>
        </div>
      </nav>
    </header>
  )
}

export default Header
