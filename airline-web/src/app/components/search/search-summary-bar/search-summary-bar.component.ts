import { DatePipe } from '@angular/common';
import { Component, input, output } from '@angular/core';

import { FlightSearchRequest } from '../../../models';
import { formatCabinClass } from '../../../utils/flight.utils';

@Component({
  selector: 'app-search-summary-bar',
  imports: [DatePipe],
  templateUrl: './search-summary-bar.component.html',
})
export class SearchSummaryBarComponent {
  readonly request = input.required<FlightSearchRequest>();
  readonly edit = output<void>();

  formatCabin = formatCabinClass;

  travellerSummary(req: FlightSearchRequest): string {
    const total = req.adults + (req.children ?? 0) + (req.infants ?? 0);
    const label = total === 1 ? 'Traveler' : 'Travelers';
    return `${total} ${label}, ${formatCabinClass(req.cabinClass)}`;
  }

  tripTypeLabel(req: FlightSearchRequest): string {
    const tripType = req.tripType ?? (req.returnDate ? 'RoundTrip' : 'OneWay');
    return tripType === 'RoundTrip' ? 'Round Trip' : 'One Way';
  }
}
