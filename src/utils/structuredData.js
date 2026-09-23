const BASE_URL = 'https://qamrahnuts.com';

export const generateOrganizationSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  'name': 'QAMRAH',
  'legalName': 'QAMRAH Fine Foods Ltd',
  'url': BASE_URL,
  'logo': `${BASE_URL}/images/logo.png`,
  'description': 'Artisanal purveyors of handpicked colossal W-180 cashews, California almonds, sacred Ajwa dates, and Iranian pistachios.',
  'email': 'concierge@qamrahnuts.com',
  'telephone': '+916235820223',
  'address': {
    '@type': 'PostalAddress',
    'streetAddress': 'BKC Commercial Complex, Bandra East',
    'addressLocality': 'Mumbai',
    'postalCode': '400051',
    'addressCountry': 'IN'
  },
  'sameAs': [
    'https://instagram.com/qamrahnuts',
    'https://facebook.com/qamrahnuts',
    'https://youtube.com/@qamrahnuts'
  ]
});

export const generateWebSiteSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  'name': 'QAMRAH',
  'url': BASE_URL,
  'potentialAction': {
    '@type': 'SearchAction',
    'target': `${BASE_URL}/shop?q={search_term_string}`,
    'query-input': 'required name=search_term_string'
  }
});

export const generateBreadcrumbSchema = (breadcrumbs = []) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  'itemListElement': breadcrumbs.map((crumb, index) => ({
    '@type': 'ListItem',
    'position': index + 1,
    'name': crumb.name,
    'item': crumb.url.startsWith('http') ? crumb.url : `${BASE_URL}${crumb.url}`
  }))
});

export const generateProductSchema = (product) => {
  if (!product) return null;

  const imageUrl = product.image || product.mainImage || '/images/pouch_cashew.jpg';
  const fullImageUrl = imageUrl.startsWith('http') ? imageUrl : `${BASE_URL}${imageUrl}`;
  const productUrl = `${BASE_URL}/product/${product.slug || product.id || ''}`;

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    'name': product.name || 'QAMRAH Premium Selection',
    'image': [fullImageUrl],
    'description': product.shortDescription || product.description || 'Premium handpicked quality dry fruits by QAMRAH.',
    'sku': product.slug || String(product.id || product._id || 'qamrah-item'),
    'brand': {
      '@type': 'Brand',
      'name': 'QAMRAH'
    },
    'offers': {
      '@type': 'Offer',
      'url': productUrl,
      'priceCurrency': 'INR',
      'price': product.price || 0,
      'availability': product.inStock !== false ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      'itemCondition': 'https://schema.org/NewCondition'
    },
    ...(product.rating ? {
      'aggregateRating': {
        '@type': 'AggregateRating',
        'ratingValue': product.rating,
        'reviewCount': product.reviewCount || 100
      }
    } : {})
  };
};

export const generateFAQSchema = (faqs = []) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  'mainEntity': faqs.map((faq) => ({
    '@type': 'Question',
    'name': faq.q || faq.question,
    'acceptedAnswer': {
      '@type': 'Answer',
      'text': faq.a || faq.answer
    }
  }))
});
