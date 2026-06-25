import { Component, input } from '@angular/core';

@Component({
  selector: 'app-booking-section',
  template: `
    <section class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div class="flex items-center gap-3 bg-brand-navy px-5 py-3.5">
        <ng-content select="[sectionIcon]" />
        <div>
          <h2 class="text-base font-semibold text-white">{{ title() }}</h2>
          @if (subtitle()) {
            <p class="text-xs text-slate-300">{{ subtitle() }}</p>
          }
        </div>
      </div>
      <div class="p-6 sm:p-8">
        <ng-content />
      </div>
    </section>
  `,
})
export class BookingSectionComponent {
  readonly title = input.required<string>();
  readonly subtitle = input<string>();
}
