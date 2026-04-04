import { useEffect } from 'react';

const BASE = 'https://gk2switchgear.com';

export default function useSEO({ title, description, canonical, schema } = {}) {
  useEffect(() => {
    // Title
    if (title) document.title = title;

    // Meta description
    setMeta('name', 'description', description || '');
    setMeta('property', 'og:title', title || '');
    setMeta('property', 'og:description', description || '');
    setMeta('property', 'og:url', canonical ? `${BASE}${canonical}` : BASE);
    setMeta('name', 'twitter:title', title || '');
    setMeta('name', 'twitter:description', description || '');

    // Canonical
    let link = document.querySelector("link[rel='canonical']");
    if (!link) { link = document.createElement('link'); link.rel = 'canonical'; document.head.appendChild(link); }
    link.href = canonical ? `${BASE}${canonical}` : BASE;

    // JSON-LD schema
    let sd = document.getElementById('page-schema');
    if (schema) {
      if (!sd) { sd = document.createElement('script'); sd.id = 'page-schema'; sd.type = 'application/ld+json'; document.head.appendChild(sd); }
      sd.textContent = JSON.stringify(schema);
    } else if (sd) {
      sd.remove();
    }
  }, [title, description, canonical]);
}

function setMeta(attr, key, value) {
  let el = document.querySelector(`meta[${attr}="${key}"]`);
  if (!el) { el = document.createElement('meta'); el.setAttribute(attr, key); document.head.appendChild(el); }
  el.setAttribute('content', value);
}
