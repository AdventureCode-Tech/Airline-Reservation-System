import { Component, input } from '@angular/core';

import { FlightSegment } from '../../models';
import { AirportLocalTimePipe } from '../../pipes/airport-local-time.pipe';
import {
  formatDurationMinutes,
  layoverMinutes,
  totalSegmentDuration,
} from '../../utils/flight.utils';
import { AirlineLogoComponent } from '../airline-logo/airline-logo.component';

@Component({
  selector: 'app-flight-leg-details',
  imports: [AirportLocalTimePipe, AirlineLogoComponent],
  template: `
    <div class="flex items-center justify-between">
      <h4 class="text-sm font-semibold text-slate-900">{{ title() }}</h4>
      <span class="text-xs text-slate-500">Total: {{ formatDuration(totalDuration(segments())) }}</span>
    </div>

    <div class="mt-4 space-y-0">
      @for (segment of segments(); track segment.flightNumber; let i = $index) {
        <div class="rounded-lg border border-slate-200 bg-white p-4">
          <div class="flex flex-wrap items-start justify-between gap-3">
            <div class="flex items-center gap-2">
              <app-airline-logo
                [airline]="segment.airline"
                [carrierCode]="segment.carrierCode"
                [flightNumber]="segment.flightNumber"
                size="sm"
              />
              <div>
                <p class="text-sm font-medium text-slate-800">{{ segment.airline }}</p>
                <p class="text-xs text-slate-500">Flight {{ segment.flightNumber }}</p>
              </div>
            </div>
            <span class="text-xs text-slate-500">Economy</span>
          </div>

          <div class="mt-4 flex flex-wrap justify-between gap-4">
            <div>
              <p class="text-sm font-bold text-slate-900">{{ segment.departureTime | airportTime:'time' }}</p>
              <p class="text-xs text-slate-600">{{ segment.origin }}</p>
              <p class="text-xs text-slate-400">{{ segment.departureTime | airportTime:'date' }}</p>
            </div>
            <div class="flex flex-col items-center justify-center px-2">
              <span class="text-xs text-brand-gold">{{ formatDuration(segment.durationMinutes) }}</span>
              <span class="mt-1 h-px w-16 bg-slate-200"></span>
            </div>
            <div class="text-right">
              <p class="text-sm font-bold text-slate-900">{{ segment.arrivalTime | airportTime:'time' }}</p>
              <p class="text-xs text-slate-600">{{ segment.destination }}</p>
              <p class="text-xs text-slate-400">{{ segment.arrivalTime | airportTime:'date' }}</p>
            </div>
          </div>
        </div>

        @if (i < segments().length - 1) {
          @let layover = layoverMinutes(segment, segments()[i + 1]);
          <div class="flex items-center gap-3 py-3">
            <span class="h-px flex-1 border-t border-dashed border-slate-300"></span>
            <span class="inline-flex items-center gap-1.5 text-xs text-slate-500">
              <svg class="h-3.5 w-3.5 text-brand-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              {{ formatDuration(layover) }} layover in {{ segment.destination }}
            </span>
            <span class="h-px flex-1 border-t border-dashed border-slate-300"></span>
          </div>
        }
      }
    </div>
  `,
})
export class FlightLegDetailsComponent {
  readonly segments = input.required<FlightSegment[]>();
  readonly title = input.required<string>();

  formatDuration = formatDurationMinutes;
  layoverMinutes = layoverMinutes;
  totalDuration = totalSegmentDuration;
}
