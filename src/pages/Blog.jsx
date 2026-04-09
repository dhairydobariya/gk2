import { Link } from 'react-router-dom';
import { blogPosts } from '../data/blog';
import useSEO from '../hooks/useSEO';
import DynamicBanner from '../components/DynamicBanner';

const categoryStyle = {
  Education: { badge: 'bg-blue-100 text-blue-700',    border: 'border-blue-400' },
  Products:  { badge: 'bg-indigo-100 text-indigo-700', border: 'border-indigo-400' },
  Safety:    { badge: 'bg-green-100 text-green-700',   border: 'border-green-400' },
  Company:   { badge: 'bg-orange-100 text-orange-700', border: 'border-orange-400' },
};
const getStyle = (cat) => categoryStyle[cat] || categoryStyle.Education;

export default function Blog() {
  useSEO({
    title: 'Electrical Switchgear Blog | MCB, Fuse, Busbar Guides | GK2 Switchgear',
    description: 'Expert articles on electrical switchgear — MCBs, HRC fuses, busbars, changeover switches, and more. Learn from GK2 Switchgear, IS/IEC certified manufacturer in Gujarat, India.',
    canonical: '/blog',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'Blog',
      name: 'GK2 Switchgear Blog',
      description: 'Expert articles on electrical switchgear, MCBs, fuses, busbars and more.',
      url: 'https://gk2switchgear.com/blog',
      publisher: { '@type': 'Organization', name: 'GK2 Switchgear', url: 'https://gk2switchgear.com' },
    },
  });

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── HERO BANNER ── */}
      <DynamicBanner page="blog" compact />

      {/* ── BREADCRUMB ── */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 max-w-6xl py-3">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-gray-500">
            <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">Blog</span>
          </nav>
        </div>
      </div>

      {/* ── ARTICLES GRID ── */}
      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4 max-w-6xl">

          <div className="mb-8">
            <span className="inline-block text-blue-600 font-semibold text-xs tracking-widest uppercase border-l-4 border-blue-600 pl-3 mb-1">Knowledge Base</span>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mt-1">All Articles</h2>
            <p className="text-gray-500 mt-1 text-sm">{blogPosts.length} articles on electrical switchgear</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts.map((post) => {
              const s = getStyle(post.category);
              return (
                <article
                  key={post.id}
                  className={`group bg-white rounded-2xl overflow-hidden flex flex-col border-2 ${s.border} shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300`}
                >
                  {/* Image */}
                  {post.image && (
                    <Link to={`/blog/${post.slug}`} className="block p-3 pb-0">
                      <div className="overflow-hidden rounded-xl">
                        <img
                          src={post.image}
                          alt={post.imageAlt || post.title}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                      </div>
                    </Link>
                  )}

                  {/* Content */}
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${s.badge}`}>
                        {post.category}
                      </span>
                      <span className="text-xs text-gray-400">{post.readTime}</span>
                    </div>

                    <h2 className="font-black text-gray-900 text-base leading-snug mb-2 group-hover:text-blue-600 transition-colors flex-1">
                      <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                    </h2>

                    <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 mb-4">{post.excerpt}</p>

                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <span className="text-xs text-gray-400">
                        {new Date(post.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                      <Link
                        to={`/blog/${post.slug}`}
                        className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 group/link"
                      >
                        Read more
                        <span className="group-hover/link:translate-x-1 transition-transform duration-200 inline-block">→</span>
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {/* CTA */}
          <div className="mt-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-8 text-center text-white">
            <h3 className="text-xl font-black mb-2">Need Expert Switchgear Advice?</h3>
            <p className="text-blue-200 text-sm mb-5 max-w-md mx-auto">Our team of electrical engineers is ready to help you select the right products for your project.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/products" className="px-6 py-3 bg-white text-blue-700 rounded-xl font-bold hover:bg-blue-50 transition-colors text-sm">Browse Products</Link>
              <Link to="/contact" className="px-6 py-3 border border-white/40 text-white rounded-xl font-bold hover:bg-white/10 transition-colors text-sm">Contact Us</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
