import { Component, input } from '@angular/core';

@Component({
  selector: 'app-booking-tips-section',
  templateUrl: './booking-tips-section.component.html',
})
export class BookingTipsSectionComponent {
  readonly tips = input.required<string[]>();
}
