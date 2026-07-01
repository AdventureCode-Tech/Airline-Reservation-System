import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import { FlightCardComponent } from '../../components/flight-card/flight-card.component';
import { FlightSearchFormComponent } from '../../components/search/flight-search-form/flight-search-form.component';
import { FlightOffer } from '../../models';
import { CurrencyFormatPipe } from '../../pipes/currency-format.pipe';
import {
  FlightFilters,
  FlightSearchStateService,
  FlightSortOption,
} from '../../services/flight-search-state.service';
import { formatCurrency } from '../../utils/currency.utils';
import { legDisplayDuration } from '../../utils/flight.utils';

type SortTab = 'recommended' | 'cheapest' | 'shortest';

@Component({
  selector: 'app-search-results',
  imports: [FlightCardComponent, FlightSearchFormComponent, CurrencyFormatPipe],
  templateUrl: './search-results.component.html',
})
export class SearchResultsComponent {
  private readonly router = inject(Router);
  readonly state = inject(FlightSearchStateService);

  readonly showMobileFilters = signal(false);
  readonly activeSortTab = signal<SortTab>('recommended');

  readonly stopOptions: { value: number | null; label: string }[] = [
    { value: null, label: 'Any stops' },
    { value: 0, label: 'Nonstop' },
    { value: 1, label: '1 Stop' },
  ];

  readonly sortTabMeta = computed(() => {
    const offers = this.state.offers();
    const currency = offers[0]?.currency ?? 'USD';

    const cheapest = offers.length
      ? offers.reduce((min, o) => (o.totalPrice < min.totalPrice ? o : min), offers[0])
      : null;

    const shortest = offers.length
      ? [...offers].sort((a, b) => this.legDuration(a) - this.legDuration(b))[0]
      : null;

    const format = (offer: FlightOffer | null) =>
      offer ? formatCurrency(offer.totalPrice, currency) : '—';

    return {
      recommended: format(cheapest),
      cheapest: format(cheapest),
      shortest: format(shortest),
    };
  });

  constructor() {
    if (!this.state.hasResults()) {
      this.router.navigate(['/']);
    }
  }

  get filters(): FlightFilters {
    return this.state.filters();
  }

  get maxPriceValue(): number {
    return this.filters.maxPrice ?? this.state.priceRange().max;
  }

  onSearchUpdated(): void {
    this.activeSortTab.set('recommended');
  }

  setSortTab(tab: SortTab): void {
    this.activeSortTab.set(tab);
    const sortBy: FlightSortOption = tab === 'shortest' ? 'duration' : 'price';
    this.state.updateFilters({ sortBy });
  }

  onMaxPriceChange(event: Event): void {
    const value = Number((event.target as HTMLInputElement).value);
    const { max } = this.state.priceRange();

    this.state.updateFilters({
      maxPrice: value >= max ? null : value,
    });
  }

  onStopsChange(value: number | null): void {
    this.state.updateFilters({ maxStops: value });
  }

  toggleAirline(airline: string): void {
    this.state.toggleAirline(airline);
  }

  resetFilters(): void {
    this.state.resetFilters();
    this.activeSortTab.set('recommended');
  }

  selectFlight(offer: FlightOffer): void {
    this.state.selectOffer(offer);
    this.router.navigate(['/booking/review']);
  }

  toggleMobileFilters(): void {
    this.showMobileFilters.update((open) => !open);
  }

  lowestPriceForStops(maxStops: number): string | null {
    const filtered = this.state.offers().filter((offer) => {
      const stops = offer.outboundSegments.length - 1;
      return stops === maxStops;
    });
    if (!filtered.length) return null;
    const min = filtered.reduce((a, b) => (a.totalPrice < b.totalPrice ? a : b));
    return formatCurrency(min.totalPrice, min.currency);
  }

  private legDuration(offer: FlightOffer): number {
    const outbound = legDisplayDuration(
      offer.outboundSegments,
      offer.outboundDurationMinutes
    );
    const ret = legDisplayDuration(
      offer.returnSegments,
      offer.returnDurationMinutes
    );
    return outbound + ret;
  }
}
