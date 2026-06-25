export type TripType = 'OneWay' | 'RoundTrip';

export type CabinClass = 'Economy' | 'PremiumEconomy' | 'Business' | 'First';

export interface FlightSearchRequest {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  adults: number;
  children?: number;
  infants?: number;
  tripType?: TripType;
  cabinClass?: CabinClass;
}

export interface FlightSegment {
  flightNumber: string;
  airline: string;
  carrierCode?: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  durationMinutes: number;
}

export interface FlightOffer {
  offerId: string;
  totalPrice: number;
  currency: string;
  outboundSegments: FlightSegment[];
  returnSegments: FlightSegment[];
}

export interface FlightResults {
  tripType: string;
  offers: FlightOffer[];
}
