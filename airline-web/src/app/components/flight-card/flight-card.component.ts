import { Component, input, output, signal } from '@angular/core';

import { FlightOffer, FlightSegment } from '../../models';
import { AirportLocalTimePipe } from '../../pipes/airport-local-time.pipe';
import { currencyDisplayPrefix } from '../../utils/currency.utils';
import {
  formatDurationMinutes,
  splitPrice,
  stopsLabel,
  totalSegmentDuration,
} from '../../utils/flight.utils';
import { AirlineLogoComponent } from '../airline-logo/airline-logo.component';
import { FlightLegDetailsComponent } from './flight-leg-details.component';

@Component({
  selector: 'app-flight-card',
  imports: [AirportLocalTimePipe, FlightLegDetailsComponent, AirlineLogoComponent],
  templateUrl: './flight-card.component.html',
})
export class FlightCardComponent {
  readonly offer = input.required<FlightOffer>();
  readonly select = output<FlightOffer>();

  readonly detailsOpen = signal(false);

  toggleDetails(): void {
    this.detailsOpen.update((v) => !v);
  }

  onSelect(): void {
    this.select.emit(this.offer());
  }

  priceParts(): { whole: string; cents: string } {
    return splitPrice(this.offer().totalPrice);
  }

  currencyPrefix(): string {
    return currencyDisplayPrefix(this.offer().currency);
  }

  primaryAirline(segments: FlightSegment[]): string {
    return segments[0]?.airline ?? 'Airline';
  }

  primarySegment(segments: FlightSegment[]): FlightSegment | undefined {
    return segments[0];
  }

  stopsLabel = stopsLabel;
  totalDuration = totalSegmentDuration;
  formatDuration = formatDurationMinutes;

  firstSegment(segments: FlightSegment[]): FlightSegment {
    return segments[0];
  }

  lastSegment(segments: FlightSegment[]): FlightSegment {
    return segments[segments.length - 1];
  }
}
