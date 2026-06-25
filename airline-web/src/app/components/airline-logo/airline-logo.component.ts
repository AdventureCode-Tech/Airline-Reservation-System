import { Component, computed, input, signal } from '@angular/core';

import { airlineInitial, airlineLogoUrl, resolveCarrierCode } from '../../utils/flight.utils';

@Component({
  selector: 'app-airline-logo',
  template: `
    @if (showImage()) {
      <img
        [src]="logoUrl()"
        [alt]="airline()"
        [class]="sizeClass()"
        class="shrink-0 rounded-md bg-white object-contain"
        (error)="onImageError()"
      />
    } @else {
      <span
        [class]="sizeClass()"
        class="flex shrink-0 items-center justify-center rounded-lg bg-brand-gold/10 font-bold text-brand-gold"
      >
        {{ airlineInitial(airline()) }}
      </span>
    }
  `,
})
export class AirlineLogoComponent {
  readonly airline = input.required<string>();
  readonly carrierCode = input<string>();
  readonly flightNumber = input<string>();
  readonly size = input<'sm' | 'md' | 'lg'>('md');

  private readonly imageFailed = signal(false);

  readonly code = computed(() =>
    resolveCarrierCode(this.carrierCode(), this.airline(), this.flightNumber())
  );

  readonly logoUrl = computed(() => airlineLogoUrl(this.code()));

  readonly showImage = computed(() => !!this.logoUrl() && !this.imageFailed());

  readonly sizeClass = computed(() => {
    switch (this.size()) {
      case 'sm':
        return 'h-8 w-8 text-xs';
      case 'lg':
        return 'h-11 w-11 text-sm';
      default:
        return 'h-9 w-9 text-sm';
    }
  });

  airlineInitial = airlineInitial;

  onImageError(): void {
    this.imageFailed.set(true);
  }
}
