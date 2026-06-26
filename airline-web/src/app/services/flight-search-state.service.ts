import { Injectable, computed, signal } from '@angular/core';

import {
  FlightOffer,
  FlightResults,
  FlightSearchRequest,
} from '../models';
import { BookingConfirmationDetails } from '../models/booking.model';

export type FlightSortOption = 'price' | 'duration' | 'departure';

export interface FlightFilters {
  maxPrice: number | null;
  airlines: string[];
  maxStops: number | null;
  sortBy: FlightSortOption;
}

@Injectable({ providedIn: 'root' })
export class FlightSearchStateService {
  private readonly searchRequestSignal = signal<FlightSearchRequest | null>(null);
  private readonly resultsSignal = signal<FlightResults | null>(null);
  private readonly selectedOfferSignal = signal<FlightOffer | null>(null);
  private readonly bookingConfirmationSignal =
    signal<BookingConfirmationDetails | null>(null);
  private readonly filtersSignal = signal<FlightFilters>({
    maxPrice: null,
    airlines: [],
    maxStops: null,
    sortBy: 'price',
  });

  readonly searchRequest = this.searchRequestSignal.asReadonly();
  readonly results = this.resultsSignal.asReadonly();
  readonly selectedOffer = this.selectedOfferSignal.asReadonly();
  readonly bookingConfirmation = this.bookingConfirmationSignal.asReadonly();
  readonly filters = this.filtersSignal.asReadonly();

  readonly offers = computed(() => this.resultsSignal()?.offers ?? []);

  readonly availableAirlines = computed(() => {
    const airlines = new Set<string>();

    for (const offer of this.offers()) {
      for (const segment of offer.outboundSegments) {
        airlines.add(segment.airline);
      }
    }

    return [...airlines].sort();
  });

  readonly priceRange = computed(() => {
    const prices = this.offers().map((offer) => offer.totalPrice);

    if (prices.length === 0) {
      return { min: 0, max: 0 };
    }

    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
    };
  });

  readonly filteredOffers = computed(() => {
    const filters = this.filtersSignal();
    let offers = [...this.offers()];

    if (filters.maxPrice !== null) {
      offers = offers.filter((offer) => offer.totalPrice <= filters.maxPrice!);
    }

    if (filters.airlines.length > 0) {
      offers = offers.filter((offer) =>
        offer.outboundSegments.some((segment) =>
          filters.airlines.includes(segment.airline)
        )
      );
    }

    if (filters.maxStops !== null) {
      offers = offers.filter(
        (offer) => offer.outboundSegments.length - 1 === filters.maxStops!
      );
    }

    return this.sortOffers(offers, filters.sortBy);
  });

  hasResults(): boolean {
    return this.resultsSignal() !== null;
  }

  setSearchResults(request: FlightSearchRequest, results: FlightResults): void {
    this.searchRequestSignal.set(request);
    this.resultsSignal.set(results);
    this.selectedOfferSignal.set(null);
    this.filtersSignal.set({
      maxPrice: null,
      airlines: [],
      maxStops: null,
      sortBy: 'price',
    });
  }

  hasSelectedOffer(): boolean {
    return this.selectedOfferSignal() !== null;
  }

  hasBookingConfirmation(): boolean {
    return this.bookingConfirmationSignal() !== null;
  }

  setBookingConfirmation(details: BookingConfirmationDetails): void {
    this.bookingConfirmationSignal.set(details);
  }

  selectOffer(offer: FlightOffer): void {
    this.selectedOfferSignal.set(offer);
  }

  updateFilters(partial: Partial<FlightFilters>): void {
    this.filtersSignal.update((current) => ({ ...current, ...partial }));
  }

  toggleAirline(airline: string): void {
    this.filtersSignal.update((current) => {
      const airlines = current.airlines.includes(airline)
        ? current.airlines.filter((item) => item !== airline)
        : [...current.airlines, airline];

      return { ...current, airlines };
    });
  }

  resetFilters(): void {
    this.filtersSignal.set({
      maxPrice: null,
      airlines: [],
      maxStops: null,
      sortBy: 'price',
    });
  }

  clear(): void {
    this.searchRequestSignal.set(null);
    this.resultsSignal.set(null);
    this.selectedOfferSignal.set(null);
    this.bookingConfirmationSignal.set(null);
    this.resetFilters();
  }

  private sortOffers(
    offers: FlightOffer[],
    sortBy: FlightSortOption
  ): FlightOffer[] {
    return [...offers].sort((a, b) => {
      switch (sortBy) {
        case 'duration':
          return this.totalDuration(a) - this.totalDuration(b);
        case 'departure':
          return (
            new Date(a.outboundSegments[0]?.departureTimeUtc ?? a.outboundSegments[0]?.departureTime ?? 0).getTime() -
            new Date(b.outboundSegments[0]?.departureTimeUtc ?? b.outboundSegments[0]?.departureTime ?? 0).getTime()
          );
        case 'price':
        default:
          return a.totalPrice - b.totalPrice;
      }
    });
  }

  private totalDuration(offer: FlightOffer): number {
    return offer.outboundSegments.reduce(
      (total, segment) => total + segment.durationMinutes,
      0
    );
  }
}
