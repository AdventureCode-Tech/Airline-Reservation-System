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

type LegSegment = {
  durationMinutes: number;
  departureTime: string;
  arrivalTime: string;
  departureTimeUtc?: string;
  arrivalTimeUtc?: string;
};

export function totalSegmentDuration(segments: { durationMinutes: number }[]): number {
  return segments.reduce((sum, s) => sum + s.durationMinutes, 0);
}

/** Elapsed wall-clock time from first departure to last arrival (uses UTC when available). */
export function legElapsedMinutes(segments: LegSegment[]): number {
  if (!segments.length) return 0;
  const first = segments[0];
  const last = segments[segments.length - 1];
  const dep = new Date(first.departureTimeUtc ?? first.departureTime).getTime();
  const arr = new Date(last.arrivalTimeUtc ?? last.arrivalTime).getTime();
  if (Number.isNaN(dep) || Number.isNaN(arr)) return 0;
  return Math.max(0, Math.round((arr - dep) / 60000));
}

/** Total travel time for a leg — prefer Ignav leg duration (includes layovers). */
export function legDisplayDuration(segments: LegSegment[], legMinutes?: number): number {
  if (legMinutes && legMinutes > 0) return legMinutes;
  const elapsed = legElapsedMinutes(segments);
  if (elapsed > 0) return elapsed;
  return totalSegmentDuration(segments);
}

/** True when arrival is on a later calendar day than departure (airport-local). */
export function arrivesNextDay(departureLocal: string, arrivalLocal: string): boolean {
  if (!departureLocal || !arrivalLocal) return false;
  const depDate = departureLocal.split('T')[0];
  const arrDate = arrivalLocal.split('T')[0];
  return arrDate > depDate;
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
  prev: { arrivalTimeUtc?: string; arrivalTime: string },
  next: { departureTimeUtc?: string; departureTime: string }
): number {
  const arrival = new Date(prev.arrivalTimeUtc ?? prev.arrivalTime).getTime();
  const departure = new Date(next.departureTimeUtc ?? next.departureTime).getTime();
  return Math.max(0, Math.round((departure - arrival) / 60000));
}

/** Format Ignav airport-local time without browser timezone conversion. */
export function formatAirportLocalTime(
  localIso: string,
  format: 'time' | 'date' | 'datetime' = 'time'
): string {
  if (!localIso) {
    return '—';
  }

  const [datePart, timePart = '00:00:00'] = localIso.split('T');
  const [year, month, day] = datePart.split('-').map(Number);
  const [hour, minute] = timePart.split(':').map(Number);
  const wallClock = new Date(year, month - 1, day, hour, minute);

  switch (format) {
    case 'date':
      return wallClock.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      });
    case 'datetime':
      return wallClock.toLocaleString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      });
    case 'time':
    default:
      return wallClock.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
      });
  }
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
