export interface NewsletterSubscribeRequest {
  email: string;
}

export interface ContactFormRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export const CONTACT_SUBJECTS = [
  'General Inquiry',
  'Flight Booking',
  'Hotel Booking',
  'Vacation Package',
  'Support',
  'Other',
] as const;

export type ContactSubject = (typeof CONTACT_SUBJECTS)[number];
