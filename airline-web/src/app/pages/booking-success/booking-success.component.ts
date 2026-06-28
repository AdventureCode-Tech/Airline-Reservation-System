import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { CardBrandLogoComponent } from '../../components/card-brand-logo/card-brand-logo.component';
import { CurrencyFormatPipe } from '../../pipes/currency-format.pipe';
import { AirportLocalTimePipe } from '../../pipes/airport-local-time.pipe';
import { AirlineLogoComponent } from '../../components/airline-logo/airline-logo.component';
import { SITE } from '../../core/site.constants';
import { formatCabinClass, formatDurationMinutes, legDisplayDuration, stopsLabel } from '../../utils/flight.utils';
import { FlightSearchStateService } from '../../services/flight-search-state.service';

@Component({
  selector: 'app-booking-success',
  imports: [RouterLink, DatePipe, DecimalPipe, AirlineLogoComponent, CardBrandLogoComponent, CurrencyFormatPipe, AirportLocalTimePipe],
  templateUrl: './booking-success.component.html',
  styles: [
    `
      @media print {
        :host {
          display: block;
        }

        .print-root {
          padding: 0 !important;
          background: white !important;
        }

        .print-ticket {
          max-width: none !important;
          margin: 0 !important;
          border-radius: 0 !important;
          box-shadow: none !important;
        }

        @page {
          margin: 12mm;
          size: A4 portrait;
        }
      }
    `,
  ],
})
export class BookingSuccessComponent {
  private readonly router = inject(Router);
  readonly state = inject(FlightSearchStateService);
  readonly site = SITE;

  readonly formatDuration = formatDurationMinutes;
  readonly stopsLabel = stopsLabel;
  readonly legDuration = legDisplayDuration;

  constructor() {
    if (!this.state.hasBookingConfirmation()) {
      this.router.navigate(['/']);
    }
  }

  tripTypeLabel(tripType: string): string {
    return tripType === 'RoundTrip' ? 'Round Trip' : 'One Way';
  }

  cabinLabel(cabin: string): string {
    return formatCabinClass(cabin as 'Economy');
  }

  printConfirmation(): void {
    window.print();
  }
}
