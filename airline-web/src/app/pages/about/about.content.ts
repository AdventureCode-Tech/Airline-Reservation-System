export interface ValueCard {
  title: string;
  description: string;
  icon: 'transparency' | 'personal' | 'support' | 'independence';
  colorClass: string;
}

export interface WhyChooseCard {
  title: string;
  description: string;
  emoji: string;
}

export const ABOUT_VALUES: ValueCard[] = [
  {
    title: 'Transparency',
    description: 'Clear pricing with no hidden fees. We explain every charge before you book.',
    icon: 'transparency',
    colorClass: 'bg-amber-100 text-brand-gold',
  },
  {
    title: 'Personal Service',
    description: 'Real travel experts who listen to your needs and find the best options for you.',
    icon: 'personal',
    colorClass: 'bg-rose-100 text-rose-600',
  },
  {
    title: '24/7 Support',
    description: 'Travel emergencies don\'t wait. Neither do we — help is always a call away.',
    icon: 'support',
    colorClass: 'bg-emerald-100 text-emerald-600',
  },
  {
    title: 'Independence',
    description: 'We\'re not tied to any airline or hotel chain. Your interests come first.',
    icon: 'independence',
    colorClass: 'bg-violet-100 text-violet-600',
  },
];

export const ABOUT_SERVICES = [
  'Flight Reservations',
  'Hotel Bookings',
  'Car Rentals & Train Tickets',
  'Cruise Vacations',
  'Vacation Packages',
];

export const WHY_CHOOSE_US: WhyChooseCard[] = [
  {
    title: 'Real People, Real Help',
    description: 'Speak with experienced travel advisors who understand your needs and preferences.',
    emoji: '🧑‍💼',
  },
  {
    title: 'No Brand Bias',
    description: 'We search across all major providers to find the best deal for you, not for us.',
    emoji: '⭐',
  },
  {
    title: 'Upfront Pricing',
    description: 'See the full cost before you commit. No surprise charges at checkout.',
    emoji: '🏷️',
  },
  {
    title: 'Available Anytime',
    description: 'Our team is here 24/7 — before, during, and after your trip.',
    emoji: '📅',
  },
  {
    title: 'Personalized Attention',
    description: 'Every itinerary is tailored to your budget, schedule, and travel style.',
    emoji: '✈️',
  },
  {
    title: 'Ongoing Support',
    description: 'From booking changes to travel disruptions, we\'re with you every step.',
    emoji: '🤝',
  },
];

export const ABOUT_IMAGES = {
  whoWeArePrimary: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=700&q=80',
  whoWeAreSecondary: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=500&q=80',
  services: 'https://images.unsplash.com/photo-1474487548417-2fb9887845f5?w=800&q=80',
};
