import React from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import About from './pages/About'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import Distributors from './pages/Distributors'
import DistributorDetail from './pages/DistributorDetail'
import Contact from './pages/Contact'
import Admin from './pages/Admin'
import Blog from './pages/Blog'
import BlogPost from './pages/BlogPost'
import NotFound from './pages/NotFound'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

function AppContent() {
  const location = useLocation()
  const isAdminPage = location.pathname.startsWith('/admin')
  const knownRoutes = ['/', '/about', '/products', '/contact', '/admin', '/blog']
  const isKnown = knownRoutes.includes(location.pathname)
    || location.pathname.startsWith('/products/')
    || location.pathname.startsWith('/admin')
    || location.pathname.startsWith('/blog/')

  // 404 — full screen, no header/footer
  if (!isKnown) {
    return <Routes><Route path="*" element={<NotFound />} /></Routes>
  }

  return (
    <div className="flex flex-col min-h-screen">
      <ScrollToTop />
      <Header />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/distributors" element={<Distributors />} />
          <Route path="/distributors/:id" element={<DistributorDetail />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {!isAdminPage && <Footer />}
    </div>
  )
}

function App() {
  const basename = import.meta.env.BASE_URL || '/'
  return (
    <BrowserRouter basename={basename}>
      <AppContent />
    </BrowserRouter>
  )
}

export default App
