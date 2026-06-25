export type TicketTierId = 'basic' | 'standard' | 'flexible';

export interface TicketTierOption {
  id: TicketTierId;
  name: string;
  apiValue: string;
  pricePerAdult: number;
  features: { label: string; included: boolean }[];
}

export interface BookingPassenger {
  title: string;
  firstName: string;
  middleName: string;
  lastName: string;
  gender: string;
  dateOfBirthDay: number;
  dateOfBirthMonth: number;
  dateOfBirthYear: number;
  tsaPrecheck?: string;
}

export interface BookingPayment {
  cardLastFour: string;
  cardHolderName: string;
  expirationMonth: string;
  expirationYear: string;
  cardBrand: string;
}

export interface BookingBillingAddress {
  streetAddress: string;
  aptSuite: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface BookingFlightSegment {
  flightNumber: string;
  airline: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  durationMinutes: number;
}

export interface BookingRequest {
  email: string;
  phone: string;
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  offerId: string;
  ticketTier: string;
  ticketTierAddon: number;
  webCheckIn: boolean;
  webCheckInPrice: number;
  cancellationProtection: boolean;
  cancellationProtectionPrice: number;
  totalAmount: number;
  currency: string;
  adults: number;
  tripType: string;
  cabinClass: string;
  basePricePerAdult: number;
  outboundSegments: BookingFlightSegment[];
  returnSegments: BookingFlightSegment[];
  passengers: BookingPassenger[];
  payment: BookingPayment;
  billingAddress: BookingBillingAddress;
}

export interface BookingResponse {
  bookingReference: string;
  status: string;
}

import { FlightSegment } from './flight.model';

export interface ConfirmationPassenger {
  fullName: string;
  type: string;
}

export interface BookingConfirmationDetails {
  bookingReference: string;
  status: string;
  bookedAt: string;
  email: string;
  phone: string;
  passengerName: string;
  passengers: ConfirmationPassenger[];
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  tripType: string;
  cabinClass: string;
  adults: number;
  totalPrice: number;
  currency: string;
  basePricePerAdult: number;
  airline: string;
  flightNumber: string;
  ticketTier: string;
  ticketTierAddon: number;
  webCheckIn: boolean;
  webCheckInPrice: number;
  cancellationProtection: boolean;
  cancellationProtectionPrice: number;
  outboundSegments: FlightSegment[];
  returnSegments: FlightSegment[];
  paymentLastFour: string;
  paymentCardBrand: string;
  paymentCardHolder: string;
}

export const PASSENGER_TITLES = ['Mr', 'Mrs', 'Ms', 'Miss', 'Dr'] as const;
export const GENDERS = ['Male', 'Female', 'Other'] as const;

export const WEB_CHECKIN_PRICE = 10.99;
export const CANCELLATION_PROTECTION_PRICE = 29.99;

export const TICKET_TIERS: TicketTierOption[] = [
  {
    id: 'basic',
    name: 'Basic Ticket',
    apiValue: 'Basic',
    pricePerAdult: 0,
    features: [
      { label: 'Personal item included', included: true },
      { label: 'Carry-on bag included', included: true },
      { label: 'Checked bag included', included: false },
      { label: 'Changes permitted', included: false },
      { label: 'Refundable', included: false },
    ],
  },
  {
    id: 'standard',
    name: 'Standard Ticket',
    apiValue: 'Standard',
    pricePerAdult: 75,
    features: [
      { label: 'Personal item included', included: true },
      { label: 'Carry-on bag included', included: true },
      { label: 'Checked bag included', included: true },
      { label: 'Changes permitted', included: true },
      { label: 'Refundable', included: false },
    ],
  },
  {
    id: 'flexible',
    name: 'Flexible Ticket',
    apiValue: 'Flexible',
    pricePerAdult: 150,
    features: [
      { label: 'Personal item included', included: true },
      { label: 'Carry-on bag included', included: true },
      { label: 'Checked bag included', included: true },
      { label: 'Changes permitted', included: true },
      { label: 'Refundable', included: true },
    ],
  },
];

export const MONTHS = [
  { value: 1, label: 'January' },
  { value: 2, label: 'February' },
  { value: 3, label: 'March' },
  { value: 4, label: 'April' },
  { value: 5, label: 'May' },
  { value: 6, label: 'June' },
  { value: 7, label: 'July' },
  { value: 8, label: 'August' },
  { value: 9, label: 'September' },
  { value: 10, label: 'October' },
  { value: 11, label: 'November' },
  { value: 12, label: 'December' },
] as const;

export const DAYS = Array.from({ length: 31 }, (_, i) => i + 1);

export function birthYears(): number[] {
  const current = new Date().getFullYear();
  return Array.from({ length: current - 1919 }, (_, i) => current - i);
}

export function expiryYears(): number[] {
  const current = new Date().getFullYear();
  return Array.from({ length: 15 }, (_, i) => current + i);
}
