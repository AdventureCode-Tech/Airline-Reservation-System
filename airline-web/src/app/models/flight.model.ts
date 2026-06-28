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
  /** Airport-local wall-clock departure time from Ignav. */
  departureTime: string;
  /** Airport-local wall-clock arrival time from Ignav. */
  arrivalTime: string;
  /** UTC instant for calculations (RFC 3339). */
  departureTimeUtc?: string;
  arrivalTimeUtc?: string;
  departureTimezone?: string;
  arrivalTimezone?: string;
  durationMinutes: number;
}

export interface FlightOffer {
  offerId: string;
  totalPrice: number;
  currency: string;
  cabinClass?: string;
  outboundSegments: FlightSegment[];
  returnSegments: FlightSegment[];
  /** Total elapsed outbound minutes including layovers (Ignav leg duration). */
  outboundDurationMinutes?: number;
  /** Total elapsed return minutes including layovers (Ignav leg duration). */
  returnDurationMinutes?: number;
}

export interface FlightResults {
  tripType: string;
  offers: FlightOffer[];
}
