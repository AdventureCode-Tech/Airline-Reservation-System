import { Component, ElementRef, computed, inject, signal, viewChild } from '@angular/core';

import { SITE } from '../../../core/site.constants';
import { SPECIAL_OFFER_TABS, SPECIAL_OFFERS } from '../../../pages/home/home.content';

@Component({
  selector: 'app-special-offers-carousel',
  templateUrl: './special-offers-carousel.component.html',
})
export class SpecialOffersCarouselComponent {
  readonly site = SITE;
  readonly tabs = SPECIAL_OFFER_TABS;
  readonly activeTab = signal('All');

  private readonly scrollContainer = viewChild<ElementRef<HTMLElement>>('scrollContainer');

  readonly filteredOffers = computed(() => {
    const tab = this.activeTab();
    if (tab === 'All') {
      return SPECIAL_OFFERS;
    }
    return SPECIAL_OFFERS.filter((offer) => offer.categories.includes(tab));
  });

  setTab(tab: string): void {
    this.activeTab.set(tab);
  }

  scrollPrev(): void {
    this.scrollContainer()?.nativeElement.scrollBy({ left: -320, behavior: 'smooth' });
  }

  scrollNext(): void {
    this.scrollContainer()?.nativeElement.scrollBy({ left: 320, behavior: 'smooth' });
  }

  onImageError(event: Event, label: string): void {
    const img = event.target as HTMLImageElement;
    img.src = `https://picsum.photos/seed/${encodeURIComponent(label)}/600/400`;
  }
}
