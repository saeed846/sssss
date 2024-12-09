import { Property } from '../types';

export const properties: Property[] = [
  {
    id: '1',
    title: 'Luxury 3+1 Apartment with Bosphorus View',
    description: 'Stunning apartment with panoramic Bosphorus views, fully renovated with high-end finishes. Features a modern kitchen, spacious living room, and a large balcony perfect for enjoying the sunset. Located in a prestigious area with easy access to public transportation.',
    price: 25000,
    city: 'Istanbul',
    neighborhood: 'Besiktas',
    bedrooms: 3,
    bathrooms: 2,
    area: 165,
    imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00',
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00',
      'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd',
      'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6'
    ],
    videoUrl: '',
    amenities: [
      'Central Heating',
      'Air Conditioning',
      'Elevator',
      'Security',
      'Smart Home System',
      'Parking'
    ],
    type: 'apartment',
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    isActive: true,
    location: {
      lat: 41.0422,
      lng: 29.0083
    },
    features: [
      '24/7 Security',
      'Underground Parking',
      'Fitness Center',
      'Children\'s Playground',
      'Concierge Service',
      'Built-in Kitchen'
    ],
    furnished: true,
    petFriendly: false,
    contact: {
      name: 'Mehmet Yilmaz',
      phone: '+90 532 123 4567',
      email: 'mehmet@example.com',
      whatsapp: '+90 532 123 4567'
    }
  }
];