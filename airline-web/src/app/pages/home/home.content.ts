export const SPECIAL_OFFER_TABS = [
  'All', 'Flights', 'Hotels', 'Car Rental', 'Trains', 'Cruises', 'Packages', 'Private Jets',
];

export interface SpecialOffer {
  id: string;
  categories: string[];
  title: string;
  subtitle: string;
  image: string;
}

const PEXELS = (id: number, width = 600) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${width}`;

export const SPECIAL_OFFERS: SpecialOffer[] = [
  {
    id: '1',
    categories: ['All', 'Packages'],
    title: 'Up to $40 OFF',
    subtitle: 'On Holiday Packages',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80',
  },
  {
    id: '2',
    categories: ['All', 'Flights'],
    title: 'Up to $25 OFF',
    subtitle: 'On Domestic Flights',
    image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=600&q=80',
  },
  {
    id: '3',
    categories: ['All', 'Hotels'],
    title: 'Up to $30 OFF',
    subtitle: 'On Hotel Bookings',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80',
  },
  {
    id: '4',
    categories: ['All', 'Cruises'],
    title: 'Up to $50 OFF',
    subtitle: 'On Cruise Vacations',
    image: 'https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?w=600&q=80',
  },
  {
    id: '5',
    categories: ['All', 'Car Rental'],
    title: 'Up to $20 OFF',
    subtitle: 'On Car Rentals',
    image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=600&q=80',
  },
  {
    id: '6',
    categories: ['All', 'Private Jets'],
    title: 'Premium Deals',
    subtitle: 'On Private Jet Charters',
    image: PEXELS(723240, 600),
  },
];

export const FEATURES = [
  { title: 'Worldwide Coverage', desc: 'Destinations across the globe' },
  { title: '24/7 Support', desc: 'Always here when you need us' },
  { title: 'Transparent Pricing', desc: 'No hidden fees or charges' },
  { title: 'Local Expertise', desc: 'Insider knowledge & tips' },
];

export const BOOKING_TIPS = [
  'Book flights and hotels together for potential package savings',
  'Consider travel insurance for protection against unexpected changes',
  'Be flexible with dates when possible for better availability',
  'Review cancellation policies before confirming reservations',
  'Ask about loyalty programs and available upgrades',
];

export interface TravelServiceItem {
  title: string;
  desc: string;
  cta: string;
  image: string;
  premium?: boolean;
  gridClass: string;
}

export const TRAVEL_SERVICES: TravelServiceItem[] = [
  {
    title: 'Flight Booking',
    desc: 'Domestic and international flight reservations with expert assistance',
    cta: 'Learn More',
    image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80',
    gridClass: 'col-span-2 row-span-2',
  },
  {
    title: 'Hotel Reservations',
    desc: 'Worldwide accommodations from budget to luxury',
    cta: 'Learn More',
    image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600&q=80',
    gridClass: 'col-span-1 row-span-1',
  },
  {
    title: 'Cruise Vacations',
    desc: 'Ocean and river cruises worldwide',
    cta: 'Learn More',
    image: 'https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?w=600&q=80',
    gridClass: 'col-span-1 row-span-1',
  },
  {
    title: 'Car Rental',
    desc: 'Vehicles at all locations',
    cta: 'More',
    image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=600&q=80',
    gridClass: 'col-span-1 row-span-1',
  },
  {
    title: 'Train Tickets',
    desc: 'Scenic routes across America',
    cta: 'More',
    image: PEXELS(358843, 800),
    gridClass: 'col-span-1 row-span-1',
  },
  {
    title: 'Vacation Packages',
    desc: 'All-inclusive packages for beach getaways, family vacations, and honeymoons',
    cta: 'Learn More',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
    gridClass: 'col-span-2 row-span-1',
  },
  {
    title: 'Private Jets',
    desc: 'Executive aviation for business and leisure travel',
    cta: 'Learn More',
    image: PEXELS(723240, 800),
    premium: true,
    gridClass: 'col-span-2 row-span-1',
  },
];

export interface DestinationCard {
  city: string;
  region: string;
  desc: string;
  image: string;
}

export const DOMESTIC_DESTINATIONS: DestinationCard[] = [
  {
    city: 'New York City',
    region: 'New York',
    desc: 'The city that never sleeps',
    image: PEXELS(466685),
  },
  {
    city: 'Los Angeles',
    region: 'California',
    desc: 'City of Angels and beaches',
    image: PEXELS(318443),
  },
  {
    city: 'Miami',
    region: 'Florida',
    desc: 'Tropical paradise and nightlife',
    image: PEXELS(2734437),
  },
  {
    city: 'Las Vegas',
    region: 'Nevada',
    desc: 'Entertainment capital of the world',
    image: PEXELS(161772),
  },
  {
    city: 'San Francisco',
    region: 'California',
    desc: 'Golden Gate and cable cars',
    image: PEXELS(1006965),
  },
  {
    city: 'Chicago',
    region: 'Illinois',
    desc: "The Windy City's architecture",
    image: PEXELS(161963),
  },
  {
    city: 'Hawaii',
    region: 'Honolulu',
    desc: 'Island paradise and beaches',
    image: PEXELS(417074),
  },
  {
    city: 'New Orleans',
    region: 'Louisiana',
    desc: 'Jazz, culture, and cuisine',
    image: PEXELS(338515),
  },
];

export const INTERNATIONAL_DESTINATIONS: DestinationCard[] = [
  {
    city: 'Paris',
    region: 'France',
    desc: 'City of lights and romance',
    image: PEXELS(830829),
  },
  {
    city: 'London',
    region: 'United Kingdom',
    desc: 'Historic landmarks and culture',
    image: PEXELS(460672),
  },
  {
    city: 'Tokyo',
    region: 'Japan',
    desc: 'Modern meets traditional',
    image: PEXELS(2506923),
  },
  {
    city: 'Dubai',
    region: 'UAE',
    desc: 'Luxury and modern architecture',
    image: PEXELS(3787839),
  },
  {
    city: 'Bali',
    region: 'Indonesia',
    desc: 'Tropical paradise beaches',
    image: PEXELS(2166553),
  },
  {
    city: 'Santorini',
    region: 'Greece',
    desc: 'White buildings and blue domes',
    image: PEXELS(1010657),
  },
  {
    city: 'Barcelona',
    region: 'Spain',
    desc: "Gaudí's masterpieces",
    image: PEXELS(1388030),
  },
  {
    city: 'Maldives',
    region: 'Indian Ocean',
    desc: 'Luxury overwater bungalows',
    image: PEXELS(1287145),
  },
];

export const WHY_CHOOSE_US = [
  { title: 'Best Price Guarantee', desc: "We guarantee the lowest prices on flights, hotels, and vacation packages. Find a better deal elsewhere? We'll match it and give you an additional discount." },
  { title: 'Secure Payment Protection', desc: 'Your payments are protected with industry-standard encryption and secure processing.' },
  { title: '24/7 Customer Support', desc: 'Real travel experts available around the clock — no bots, no waiting.' },
  { title: 'Flexible Booking Options', desc: 'Change plans with flexible booking options tailored to your needs.' },
  { title: 'Trusted by Millions', desc: 'Join millions of travelers who trust us for their journeys worldwide.' },
  { title: 'Expert Travel Consultants', desc: 'Personalized recommendations from experienced travel professionals.' },
];

export const STATS = [
  { value: 'Curated', label: 'Travel Planning' },
  { value: 'Handpicked', label: 'Destinations' },
  { value: '24/7', label: 'Support' },
  { value: 'Happy', label: 'Travelers' },
];

export const FAQS = [
  { q: 'How do I book a flight through your website?', a: 'Use the search form on our homepage to find flights, select your preferred option, and complete the booking with your passenger details.' },
  { q: 'What is your cancellation policy?', a: 'Cancellation policies vary by airline and fare type. Our team will explain options before you confirm your booking.' },
  { q: 'Do you offer travel insurance?', a: 'Yes, we can help you add travel insurance to protect against unexpected changes and emergencies.' },
  { q: 'Can I make changes to my booking after confirmation?', a: 'Most bookings can be modified depending on fare rules. Contact our 24/7 support team for assistance.' },
  { q: 'How far in advance should I book my trip?', a: 'For the best availability and pricing, we recommend booking domestic trips 1–3 months ahead and international trips 3–6 months ahead.' },
  { q: 'What payment methods do you accept?', a: 'We accept Visa, Mastercard, American Express, and PayPal.' },
];
