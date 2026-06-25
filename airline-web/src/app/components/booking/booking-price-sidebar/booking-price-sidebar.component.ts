import { Component, input } from '@angular/core';

import { CurrencyFormatPipe } from '../../../pipes/currency-format.pipe';

@Component({
  selector: 'app-booking-price-sidebar',
  imports: [CurrencyFormatPipe],
  templateUrl: './booking-price-sidebar.component.html',
})
export class BookingPriceSidebarComponent {
  readonly currency = input.required<string>();
  readonly adultCount = input.required<number>();
  readonly basePricePerAdult = input.required<number>();
  readonly tierAddonTotal = input.required<number>();
  readonly tierName = input.required<string>();
  readonly webCheckIn = input.required<boolean>();
  readonly webCheckInPrice = input.required<number>();
  readonly cancellationProtection = input.required<boolean>();
  readonly cancellationPrice = input.required<number>();
  readonly totalPrice = input.required<number>();
}
