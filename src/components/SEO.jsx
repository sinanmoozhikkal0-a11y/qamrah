import { useEffect } from 'react';

const SITE_ORIGIN = 'https://qamrahnuts.com';
const DEFAULT_TITLE = 'QAMRAH – Royal Dry Fruits, Premium Nuts & Sacred Dates';
const DEFAULT_DESC = 'Discover QAMRAH\'s artisanal collection of handpicked W-180 Jumbo Cashews, California Almonds, Saudi Ajwa Dates, Iranian Pistachios, and Luxury Mix Nuts.';
const DEFAULT_IMAGE = `${SITE_ORIGIN}/images/hero_luxury_bg.jpg`;

/**
 * Lightweight, zero-dependency SEO manager for React Router.
 * Dynamically updates document head tags and JSON-LD structured data on route changes.
 */
export default function SEO({
  title,
  description = DEFAULT_DESC,
  canonical = '',
  ogImage,
  ogType = 'website',
  jsonLd,
  noIndex = false
}) {
  useEffect(() => {
    // 1. Update Title
    const formattedTitle = title
      ? (title.includes('QAMRAH') ? title : `${title} — QAMRAH`)
      : DEFAULT_TITLE;
    document.title = formattedTitle;

    // Helper to set or update meta tag
    const setMetaTag = (attribute, name, content) => {
      if (!content) return;
      let element = document.querySelector(`meta[${attribute}="${name}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Helper to set or update link tag
    const setLinkTag = (rel, href) => {
      if (!href) return;
      let element = document.querySelector(`link[rel="${rel}"]`);
      if (!element) {
        element = document.createElement('link');
        element.setAttribute('rel', rel);
        document.head.appendChild(element);
      }
      element.setAttribute('href', href);
    };

    // 2. Canonical URL
    const cleanCanonical = canonical
      ? (canonical.startsWith('http') ? canonical : `${SITE_ORIGIN}${canonical.startsWith('/') ? '' : '/'}${canonical}`)
      : `${SITE_ORIGIN}${window.location.pathname}`;
    setLinkTag('canonical', cleanCanonical);

    // 3. Meta Description & Robots
    setMetaTag('name', 'description', description);
    setMetaTag('name', 'robots', noIndex ? 'noindex, nofollow' : 'index, follow');

    // 4. Open Graph Tags
    const fullOgImage = ogImage
      ? (ogImage.startsWith('http') ? ogImage : `${SITE_ORIGIN}${ogImage.startsWith('/') ? '' : '/'}${ogImage}`)
      : DEFAULT_IMAGE;

    setMetaTag('property', 'og:site_name', 'QAMRAH');
    setMetaTag('property', 'og:type', ogType);
    setMetaTag('property', 'og:title', formattedTitle);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:url', cleanCanonical);
    setMetaTag('property', 'og:image', fullOgImage);

    // 5. Twitter Card Tags
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', formattedTitle);
    setMetaTag('name', 'twitter:description', description);
    setMetaTag('name', 'twitter:image', fullOgImage);

    // 6. JSON-LD Structured Data
    const scriptId = 'qamrah-jsonld-schema';
    let scriptEl = document.getElementById(scriptId);

    if (jsonLd) {
      if (!scriptEl) {
        scriptEl = document.createElement('script');
        scriptEl.id = scriptId;
        scriptEl.type = 'application/ld+json';
        document.head.appendChild(scriptEl);
      }
      scriptEl.textContent = JSON.stringify(jsonLd);
    } else if (scriptEl) {
      scriptEl.remove();
    }

    return () => {
      // Clean up structured data on unmount if necessary
      const el = document.getElementById(scriptId);
      if (el) el.remove();
    };
  }, [title, description, canonical, ogImage, ogType, jsonLd, noIndex]);

  return null;
}
