const AIRLINE_NAME_TO_CODE: Record<string, string> = {
  'American Airlines': 'AA',
  'Delta Air Lines': 'DL',
  Delta: 'DL',
  'United Airlines': 'UA',
  United: 'UA',
  'Southwest Airlines': 'WN',
  Southwest: 'WN',
  'JetBlue Airways': 'B6',
  JetBlue: 'B6',
  'Alaska Airlines': 'AS',
  'Spirit Airlines': 'NK',
  'Frontier Airlines': 'F9',
  'Hawaiian Airlines': 'HA',
  'Allegiant Air': 'G4',
  'British Airways': 'BA',
  'Air France': 'AF',
  Lufthansa: 'LH',
  Emirates: 'EK',
  'Qatar Airways': 'QR',
  'Turkish Airlines': 'TK',
  KLM: 'KL',
  'Virgin Atlantic': 'VS',
  'Air Canada': 'AC',
  WestJet: 'WS',
  'Japan Airlines': 'JL',
  'All Nippon Airways': 'NH',
  'Singapore Airlines': 'SQ',
  'Cathay Pacific': 'CX',
  Qantas: 'QF',
};

export function resolveCarrierCode(
  carrierCode?: string,
  airline?: string,
  flightNumber?: string
): string {
  if (carrierCode?.trim()) {
    return carrierCode.trim().toUpperCase();
  }

  const name = airline?.trim();
  if (name && AIRLINE_NAME_TO_CODE[name]) {
    return AIRLINE_NAME_TO_CODE[name];
  }

  const flight = flightNumber?.trim().toUpperCase() ?? '';
  const match = flight.match(/^([A-Z0-9]{2})/);
  return match?.[1] ?? '';
}

export function airlineLogoUrl(carrierCode: string): string {
  const code = carrierCode.trim().toUpperCase();
  return code ? `https://images.kiwi.com/airlines/64/${code}.png` : '';
}

export function airlineInitial(airline: string): string {
  return airline.trim().charAt(0).toUpperCase() || 'A';
}

export function formatDurationMinutes(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

export function totalSegmentDuration(segments: { durationMinutes: number }[]): number {
  return segments.reduce((sum, s) => sum + s.durationMinutes, 0);
}

export function stopCount(segments: unknown[]): number {
  return Math.max(0, segments.length - 1);
}

export function stopsLabel(segments: unknown[]): string {
  const stops = stopCount(segments);
  if (stops === 0) return 'Non-stop';
  return stops === 1 ? '1 Stop' : `${stops} Stops`;
}

export function layoverMinutes(
  prev: { arrivalTime: string },
  next: { departureTime: string }
): number {
  const arrival = new Date(prev.arrivalTime).getTime();
  const departure = new Date(next.departureTime).getTime();
  return Math.max(0, Math.round((departure - arrival) / 60000));
}

export function splitPrice(amount: number): { whole: string; cents: string } {
  const fixed = amount.toFixed(2);
  const [whole, cents] = fixed.split('.');
  return { whole, cents };
}

export function formatCabinClass(cabin?: string): string {
  switch (cabin) {
    case 'PremiumEconomy':
      return 'Premium Economy';
    case 'Business':
      return 'Business';
    case 'First':
      return 'First Class';
    default:
      return 'Economy';
  }
}
