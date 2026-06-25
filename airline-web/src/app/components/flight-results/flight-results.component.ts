import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, input } from '@angular/core';

import { FlightOffer, FlightSegment } from '../../models';

@Component({
  selector: 'app-flight-results',
  imports: [DatePipe, DecimalPipe],
  template: `
    <section class="mt-8">
      <h2 class="mb-4 text-xl font-semibold text-slate-900">
        {{ offers().length }} flight{{ offers().length === 1 ? '' : 's' }} found
      </h2>

      <div class="space-y-4">
        @for (offer of offers(); track offer.offerId) {
          <article
            class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-sky-300 hover:shadow-md"
          >
            <div class="flex flex-wrap items-start justify-between gap-4">
              <div class="space-y-4">
                @for (segment of offer.outboundSegments; track segment.flightNumber) {
                  <div class="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                    <span class="font-semibold text-slate-900">{{ segment.airline }}</span>
                    <span class="text-slate-600">{{ segment.flightNumber }}</span>
                    <span>{{ segment.origin }} → {{ segment.destination }}</span>
                    <span class="text-slate-500">
                      {{ segment.departureTime | date: 'HH:mm' }} –
                      {{ segment.arrivalTime | date: 'HH:mm' }}
                    </span>
                    <span class="text-slate-400">{{ formatDuration(segment) }}</span>
                  </div>
                }

                @if (offer.returnSegments.length > 0) {
                  <div class="border-t border-slate-100 pt-3">
                    <p class="mb-2 text-xs font-medium uppercase tracking-wide text-slate-400">
                      Return
                    </p>
                    @for (segment of offer.returnSegments; track segment.flightNumber) {
                      <div class="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                        <span class="font-semibold text-slate-900">{{ segment.airline }}</span>
                        <span>{{ segment.origin }} → {{ segment.destination }}</span>
                        <span class="text-slate-500">
                          {{ segment.departureTime | date: 'HH:mm' }} –
                          {{ segment.arrivalTime | date: 'HH:mm' }}
                        </span>
                      </div>
                    }
                  </div>
                }
              </div>

              <div class="text-right">
                <p class="text-2xl font-bold text-sky-700">
                  {{ offer.currency }} {{ offer.totalPrice | number: '1.0-0' }}
                </p>
                <p class="text-xs text-slate-500">Total price</p>
              </div>
            </div>
          </article>
        }
      </div>
    </section>
  `,
})
export class FlightResultsComponent {
  readonly offers = input.required<FlightOffer[]>();

  formatDuration(segment: FlightSegment): string {
    const hours = Math.floor(segment.durationMinutes / 60);
    const minutes = segment.durationMinutes % 60;
    return `${hours}h ${minutes}m`;
  }
}
