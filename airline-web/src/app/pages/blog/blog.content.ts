export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  publishedAt: string;
  readMinutes: number;
  image: string;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    id: '1',
    title: '10 Essential Tips for Booking Flights in 2026',
    excerpt:
      'Learn how to find the best fares, avoid hidden fees, and time your bookings for maximum savings on domestic and international flights.',
    category: 'Flight Tips',
    author: 'MyAdventureCode Team',
    publishedAt: '2026-06-01',
    readMinutes: 6,
    image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80',
  },
  {
    id: '2',
    title: 'How to Plan the Perfect Family Vacation',
    excerpt:
      'From choosing kid-friendly destinations to packing smart, our guide helps families create stress-free travel memories together.',
    category: 'Travel Planning',
    author: 'MyAdventureCode Team',
    publishedAt: '2026-05-22',
    readMinutes: 8,
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
  },
  {
    id: '3',
    title: 'Understanding Travel Insurance: What You Need to Know',
    excerpt:
      'Trip cancellation, medical coverage, and baggage protection — we break down when travel insurance is worth it and what to look for.',
    category: 'Travel Safety',
    author: 'MyAdventureCode Team',
    publishedAt: '2026-05-10',
    readMinutes: 5,
    image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=80',
  },
  {
    id: '4',
    title: 'Best Times to Book Hotels for Summer Travel',
    excerpt:
      'Discover the sweet spots for hotel reservations and how working with a travel agent can unlock rates you won\'t find online.',
    category: 'Hotel Deals',
    author: 'MyAdventureCode Team',
    publishedAt: '2026-04-28',
    readMinutes: 4,
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
  },
  {
    id: '5',
    title: 'Cruise Vacations: A Beginner\'s Complete Guide',
    excerpt:
      'First time cruising? We cover everything from choosing your cabin to onboard dining, excursions, and what to pack.',
    category: 'Cruises',
    author: 'MyAdventureCode Team',
    publishedAt: '2026-04-15',
    readMinutes: 7,
    image: 'https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?w=800&q=80',
  },
  {
    id: '6',
    title: 'Why Book Through a Travel Agency in the Digital Age',
    excerpt:
      'Online booking is convenient, but a personal travel expert saves time, money, and headaches — especially when plans change.',
    category: 'Industry Insights',
    author: 'MyAdventureCode Team',
    publishedAt: '2026-04-02',
    readMinutes: 5,
    image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80',
  },
];

export const BLOG_CATEGORIES = [
  'All',
  'Flight Tips',
  'Travel Planning',
  'Travel Safety',
  'Hotel Deals',
  'Cruises',
  'Industry Insights',
] as const;
