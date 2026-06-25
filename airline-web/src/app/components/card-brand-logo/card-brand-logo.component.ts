import { Component, computed, input } from '@angular/core';

import { cardBrandLogoPath } from '../../utils/payment.utils';

@Component({
  selector: 'app-card-brand-logo',
  template: `
    @if (logoPath()) {
      <img
        [src]="logoPath()!"
        [alt]="brand()"
        [class]="heightClass()"
        class="w-auto object-contain"
      />
    } @else {
      <span class="text-xs font-bold text-slate-400">{{ brand() }}</span>
    }
  `,
})
export class CardBrandLogoComponent {
  readonly brand = input.required<string>();
  readonly height = input<'sm' | 'md'>('md');

  readonly logoPath = computed(() => cardBrandLogoPath(this.brand()));

  readonly heightClass = computed(() => (this.height() === 'sm' ? 'h-5' : 'h-7'));
}
