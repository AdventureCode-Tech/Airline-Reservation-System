import { Component, input } from '@angular/core';

import { TravelServiceItem } from '../../../pages/home/home.content';

@Component({
  selector: 'app-travel-services-bento',
  templateUrl: './travel-services-bento.component.html',
})
export class TravelServicesBentoComponent {
  readonly services = input.required<TravelServiceItem[]>();

  onImageError(event: Event, label: string): void {
    const img = event.target as HTMLImageElement;
    img.src = `https://picsum.photos/seed/${encodeURIComponent(label)}/800/600`;
  }
}
