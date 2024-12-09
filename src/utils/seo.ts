export function generateMetaTags(property: {
  title: string;
  description: string;
  imageUrl: string;
  price: number;
  city: string;
  neighborhood: string;
}) {
  return {
    title: `${property.title} | RentHub`,
    description: property.description,
    'og:title': `${property.title} | RentHub`,
    'og:description': property.description,
    'og:image': property.imageUrl,
    'og:type': 'website',
    'og:price:amount': property.price,
    'og:price:currency': 'TRY',
    'og:locality': property.city,
    'og:region': property.neighborhood,
    'twitter:card': 'summary_large_image',
    'twitter:title': `${property.title} | RentHub`,
    'twitter:description': property.description,
    'twitter:image': property.imageUrl
  };
}

export function generateSitemap(properties: any[]) {
  const baseUrl = 'https://renthub.com';
  
  const propertyUrls = properties.map(property => ({
    url: `${baseUrl}/property/${property.id}`,
    lastmod: property.updatedAt || property.createdAt,
    changefreq: 'daily',
    priority: 0.8
  }));

  const staticUrls = [
    { url: baseUrl, changefreq: 'daily', priority: 1.0 },
    { url: `${baseUrl}/listings`, changefreq: 'hourly', priority: 0.9 },
    { url: `${baseUrl}/about`, changefreq: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/contact`, changefreq: 'monthly', priority: 0.5 }
  ];

  return [...staticUrls, ...propertyUrls];
}