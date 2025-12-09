import { useEffect } from 'react';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  ogType?: 'website' | 'article' | 'product';
  ogImage?: string;
  canonical?: string;
  noindex?: boolean;
  structuredData?: object;
}

export function SEO({
  title,
  description,
  keywords,
  ogType = 'website',
  ogImage = '/images/Logo-bP9JPH.png',
  canonical,
  noindex = false,
  structuredData,
}: SEOProps) {
  const siteUrl = 'https://bigpartner.in';
  const fullTitle = `${title} | Big Partner`;
  const canonicalUrl = canonical || window.location.href;

  useEffect(() => {
    // Update document title
    document.title = fullTitle;

    // Update or create meta tags
    const updateMetaTag = (name: string, content: string, isProperty = false) => {
      const attribute = isProperty ? 'property' : 'name';
      let element = document.querySelector(`meta[${attribute}="${name}"]`);
      
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      
      element.setAttribute('content', content);
    };

    // Basic meta tags
    updateMetaTag('description', description);
    if (keywords) {
      updateMetaTag('keywords', keywords);
    }

    // Open Graph tags
    updateMetaTag('og:title', fullTitle, true);
    updateMetaTag('og:description', description, true);
    updateMetaTag('og:type', ogType, true);
    updateMetaTag('og:url', canonicalUrl, true);
    updateMetaTag('og:image', `${siteUrl}${ogImage}`, true);
    updateMetaTag('og:site_name', 'Big Partner', true);

    // Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', fullTitle);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', `${siteUrl}${ogImage}`);

    // Robots meta tag
    if (noindex) {
      updateMetaTag('robots', 'noindex, nofollow');
    } else {
      updateMetaTag('robots', 'index, follow');
    }

    // Canonical link
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonicalUrl);

    // Structured data (JSON-LD)
    if (structuredData) {
      let scriptTag = document.querySelector('script[type="application/ld+json"]');
      if (!scriptTag) {
        scriptTag = document.createElement('script');
        scriptTag.setAttribute('type', 'application/ld+json');
        document.head.appendChild(scriptTag);
      }
      scriptTag.textContent = JSON.stringify(structuredData);
    }
  }, [title, description, keywords, ogType, ogImage, canonicalUrl, noindex, structuredData, fullTitle, siteUrl]);

  return null;
}

// Organization structured data for the entire site
export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'RealEstateAgent',
  name: 'Big Partner',
  description: 'Premier real estate investment and partnership platform in India',
  url: 'https://bigpartner.in',
  logo: 'https://bigpartner.in/images/Logo-bP9JPH.png',
  image: 'https://bigpartner.in/images/Logo-bP9JPH.png',
  telephone: '+919600047740',
  email: 'info@bigpartner.in',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '#61, 5th Cross Street, Logaiah Colony, Saligramam',
    addressLocality: 'Chennai',
    addressRegion: 'Tamil Nadu',
    postalCode: '600093',
    addressCountry: 'IN',
  },
  sameAs: [
    'https://bigpartner.in',
  ],
  areaServed: {
    '@type': 'Country',
    name: 'India',
  },
  priceRange: '₹₹₹',
};
