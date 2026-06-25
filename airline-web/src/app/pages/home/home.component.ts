import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import { BookingTipsSectionComponent } from '../../components/home/booking-tips-section/booking-tips-section.component';
import { LiveSupportBannerComponent } from '../../components/home/live-support-banner/live-support-banner.component';
import { SpecialOffersCarouselComponent } from '../../components/home/special-offers-carousel/special-offers-carousel.component';
import { TravelServicesBentoComponent } from '../../components/home/travel-services-bento/travel-services-bento.component';
import { FlightSearchFormComponent } from '../../components/search/flight-search-form/flight-search-form.component';
import { SITE } from '../../core/site.constants';
import {
  BOOKING_TIPS,
  DOMESTIC_DESTINATIONS,
  FAQS,
  FEATURES,
  INTERNATIONAL_DESTINATIONS,
  STATS,
  TRAVEL_SERVICES,
  WHY_CHOOSE_US,
} from './home.content';

@Component({
  selector: 'app-home',
  imports: [
    FlightSearchFormComponent,
    SpecialOffersCarouselComponent,
    BookingTipsSectionComponent,
    LiveSupportBannerComponent,
    TravelServicesBentoComponent,
  ],
  templateUrl: './home.component.html',
})
export class HomeComponent {
  private readonly router = inject(Router);

  readonly site = SITE;
  readonly features = FEATURES;
  readonly bookingTips = BOOKING_TIPS;
  readonly travelServices = TRAVEL_SERVICES;
  readonly domesticDestinations = DOMESTIC_DESTINATIONS;
  readonly internationalDestinations = INTERNATIONAL_DESTINATIONS;
  readonly whyChooseUs = WHY_CHOOSE_US;
  readonly stats = STATS;
  readonly faqs = FAQS;

  readonly openFaqIndex = signal<number | null>(null);

  toggleFaq(index: number): void {
    this.openFaqIndex.update((current) => (current === index ? null : index));
  }

  onSearchComplete(): void {
    this.router.navigate(['/results']);
  }

  onDestImageError(event: Event, city: string): void {
    const img = event.target as HTMLImageElement;
    img.src = `https://picsum.photos/seed/${encodeURIComponent(city)}/600/400`;
  }
}
