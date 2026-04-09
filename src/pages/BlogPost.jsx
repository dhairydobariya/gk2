import { useParams, Link } from 'react-router-dom';
import { getBlogPost, blogPosts } from '../data/blog';
import useSEO from '../hooks/useSEO';

// Simple markdown-like renderer for the blog content
function renderContent(content) {
  const lines = content.split('\n');
  const elements = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i].trim();

    if (!line) { i++; continue; }

    // H2
    if (line.startsWith('## ')) {
      elements.push(<h2 key={i} className="text-2xl font-black text-gray-900 mt-8 mb-4">{line.slice(3)}</h2>);
    }
    // H3
    else if (line.startsWith('### ')) {
      elements.push(<h3 key={i} className="text-lg font-bold text-gray-900 mt-6 mb-3">{line.slice(4)}</h3>);
    }
    // Table header row
    else if (line.startsWith('|') && lines[i + 1]?.trim().startsWith('|---')) {
      const headers = line.split('|').filter(Boolean).map(h => h.trim());
      const rows = [];
      i += 2; // skip separator
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        rows.push(lines[i].trim().split('|').filter(Boolean).map(c => c.trim()));
        i++;
      }
      elements.push(
        <div key={`table-${i}`} className="overflow-x-auto my-6">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-blue-600 text-white">
                {headers.map((h, hi) => <th key={hi} className="px-4 py-2 text-left font-semibold">{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, ri) => (
                <tr key={ri} className={ri % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  {row.map((cell, ci) => <td key={ci} className="px-4 py-2 border-b border-gray-100">{cell}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      continue;
    }
    // Bullet list
    else if (line.startsWith('- ') || line.startsWith('* ')) {
      const items = [];
      while (i < lines.length && (lines[i].trim().startsWith('- ') || lines[i].trim().startsWith('* '))) {
        items.push(lines[i].trim().slice(2));
        i++;
      }
      elements.push(
        <ul key={`ul-${i}`} className="my-4 space-y-2">
          {items.map((item, ii) => (
            <li key={ii} className="flex items-start gap-2 text-gray-700 text-sm sm:text-base">
              <span className="text-blue-600 mt-1 flex-shrink-0">•</span>
              <span dangerouslySetInnerHTML={{ __html: inlineFormat(item) }} />
            </li>
          ))}
        </ul>
      );
      continue;
    }
    // Numbered list
    else if (/^\d+\./.test(line)) {
      const items = [];
      while (i < lines.length && /^\d+\./.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^\d+\.\s*/, ''));
        i++;
      }
      elements.push(
        <ol key={`ol-${i}`} className="my-4 space-y-2 list-decimal list-inside">
          {items.map((item, ii) => (
            <li key={ii} className="text-gray-700 text-sm sm:text-base" dangerouslySetInnerHTML={{ __html: inlineFormat(item) }} />
          ))}
        </ol>
      );
      continue;
    }
    // Checkmark list (✓)
    else if (line.startsWith('✓')) {
      const items = [];
      while (i < lines.length && lines[i].trim().startsWith('✓')) {
        items.push(lines[i].trim().slice(1).trim());
        i++;
      }
      elements.push(
        <ul key={`check-${i}`} className="my-4 space-y-2">
          {items.map((item, ii) => (
            <li key={ii} className="flex items-start gap-2 text-gray-700 text-sm sm:text-base">
              <span className="text-green-600 mt-0.5 flex-shrink-0 font-bold">✓</span>
              <span dangerouslySetInnerHTML={{ __html: inlineFormat(item) }} />
            </li>
          ))}
        </ul>
      );
      continue;
    }
    // Paragraph
    else {
      elements.push(
        <p key={i} className="text-gray-700 leading-relaxed text-sm sm:text-base my-3"
          dangerouslySetInnerHTML={{ __html: inlineFormat(line) }} />
      );
    }
    i++;
  }
  return elements;
}

// Handle inline bold, links
function inlineFormat(text) {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 hover:underline font-medium">$1</a>');
}

export default function BlogPost() {
  const { slug } = useParams();
  const post = getBlogPost(slug);

  const relatedPosts = blogPosts.filter(p => p.slug !== slug).slice(0, 3);

  useSEO(post ? {
    title: post.metaTitle,
    description: post.metaDescription,
    canonical: `/blog/${post.slug}`,
    schema: {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: post.title,
      description: post.metaDescription,
      image: post.image ? `https://gk2switchgear.com${post.image}` : 'https://gk2switchgear.com/og-image.png',
      datePublished: post.date,
      dateModified: post.date,
      author: { '@type': 'Organization', name: 'GK2 Switchgear', url: 'https://gk2switchgear.com' },
      publisher: {
        '@type': 'Organization',
        name: 'GK2 Switchgear',
        url: 'https://gk2switchgear.com',
        logo: { '@type': 'ImageObject', url: 'https://gk2switchgear.com/logo.png' },
      },
      mainEntityOfPage: { '@type': 'WebPage', '@id': `https://gk2switchgear.com/blog/${post.slug}` },
    },
  } : {
    title: 'Article Not Found | GK2 Switchgear Blog',
    description: 'The requested article could not be found.',
  });

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-6xl mb-4">📄</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Article Not Found</h1>
          <Link to="/blog" className="text-blue-600 hover:underline font-medium">← Back to Blog</Link>
        </div>
      </div>
    );
  }

  const categoryColors = {
    Education: 'bg-blue-600 text-white',
    Products:  'bg-indigo-600 text-white',
    Safety:    'bg-green-600 text-white',
    Company:   'bg-orange-500 text-white',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-gray-500 flex-wrap">
            <Link to="/" className="hover:text-blue-600">Home</Link>
            <span>/</span>
            <Link to="/blog" className="hover:text-blue-600">Blog</Link>
            <span>/</span>
            <span className="text-gray-900 font-medium truncate max-w-xs">{post.title}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-4xl py-10 sm:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main article */}
          <article className="lg:col-span-2">
            {/* Header */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm mb-6 overflow-hidden">
              {/* Hero image */}
              {post.image && (
                <div className="aspect-video overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.imageAlt || post.title}
                    className="w-full h-full object-cover"
                    loading="eager"
                  />
                </div>
              )}
              <div className="p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${categoryColors[post.category] || 'bg-gray-100 text-gray-600'}`}>
                    {post.category}
                  </span>
                  <span className="text-xs text-gray-400">{post.readTime}</span>
                  <span className="text-xs text-gray-400">
                    {new Date(post.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight mb-4">{post.title}</h1>
                <p className="text-gray-500 text-base leading-relaxed border-l-4 border-blue-600 pl-4 italic">{post.excerpt}</p>
              </div>
            </div>

            {/* Content */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
              {renderContent(post.content)}
            </div>

            {/* Author / Publisher */}
            <div className="mt-6 bg-blue-50 border border-blue-100 rounded-2xl p-5 flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-black text-lg flex-shrink-0">
                GK2
              </div>
              <div>
                <p className="font-bold text-gray-900 text-sm">GK2 Switchgear</p>
                <p className="text-gray-500 text-xs mt-0.5">IS/IEC certified switchgear manufacturer · Umbhel, Gujarat, India · 10+ years experience</p>
              </div>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* CTA */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-6 text-white">
              <h3 className="font-black text-base mb-2">Need Switchgear?</h3>
              <p className="text-blue-200 text-xs mb-4 leading-relaxed">Browse our IS/IEC certified product range or get in touch for a quote.</p>
              <div className="space-y-2">
                <Link to="/products" className="block w-full text-center bg-white text-blue-700 px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-blue-50 transition-colors">
                  Browse Products
                </Link>
                <Link to="/contact" className="block w-full text-center border border-white/40 text-white px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-white/10 transition-colors">
                  Get a Quote
                </Link>
              </div>
            </div>

            {/* Related articles */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h3 className="font-black text-gray-900 text-sm mb-4 border-b border-gray-100 pb-3">More Articles</h3>
              <div className="space-y-4">
                {relatedPosts.map(related => (
                  <Link key={related.id} to={`/blog/${related.slug}`} className="block group">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${categoryColors[related.category] || 'bg-gray-100 text-gray-600'}`}>
                      {related.category}
                    </span>
                    <p className="text-sm font-semibold text-gray-800 mt-1.5 group-hover:text-blue-600 transition-colors leading-snug">
                      {related.title}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">{related.readTime}</p>
                  </Link>
                ))}
              </div>
            </div>

            {/* Quick links */}
            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5">
              <h3 className="font-black text-gray-900 text-sm mb-3">Quick Links</h3>
              <div className="space-y-2">
                {[
                  { label: 'MCB Products', to: '/products?category=mcb' },
                  { label: 'Busbar Products', to: '/products?category=busbar' },
                  { label: 'HRC Fuse Products', to: '/products?category=fuse' },
                  { label: 'Changeover Switches', to: '/products?category=onload-changeover-switch' },
                  { label: 'About GK2', to: '/about' },
                ].map((l, i) => (
                  <Link key={i} to={l.to} className="flex items-center justify-between text-sm text-gray-600 hover:text-blue-600 py-1.5 border-b border-gray-100 last:border-0 group">
                    {l.label}
                    <span className="group-hover:translate-x-1 transition-transform duration-200 text-gray-400">→</span>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
