import { Component, ElementRef, forwardRef, inject, input, signal } from '@angular/core';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import {
  Subject,
  catchError,
  debounceTime,
  distinctUntilChanged,
  filter,
  of,
  switchMap,
  tap,
} from 'rxjs';

import { Airport } from '../../models';
import { AirportService } from '../../services/airport.service';

@Component({
  selector: 'app-airport-autocomplete',
  imports: [FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AirportAutocompleteComponent),
      multi: true,
    },
  ],
  template: `
    <div class="relative">
      <label class="mb-1 block text-sm font-medium text-slate-700">
        {{ label() }}
      </label>
      <input
        type="text"
        class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm shadow-sm outline-none transition focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 disabled:bg-slate-100"
        [placeholder]="placeholder()"
        [disabled]="isDisabled()"
        [ngModel]="displayText()"
        (ngModelChange)="onInputChange($event)"
        (focus)="onFocus()"
        (blur)="onBlur()"
        autocomplete="off"
      />

      @if (loading()) {
        <span class="absolute right-3 top-9 text-xs text-slate-400" aria-hidden="true">
          Searching…
        </span>
      }

      @if (showDropdown() && suggestions().length > 0) {
        <ul
          class="absolute z-20 mt-1 max-h-56 w-full overflow-auto rounded-lg border border-slate-200 bg-white py-1 shadow-lg"
          role="listbox"
        >
          @for (airport of suggestions(); track airport.code) {
            <li
              role="option"
              class="cursor-pointer px-3 py-2 text-sm hover:bg-amber-50"
              (mousedown)="selectAirport(airport)"
            >
              <span class="font-semibold text-slate-900">{{ airport.city }}</span>
              @if (airport.state) {
                <span class="text-slate-500">, {{ airport.state }}</span>
              }
              <span class="text-slate-500"> ({{ airport.code }})</span>
              <span class="block text-xs text-slate-400">{{ airport.name }}</span>
            </li>
          }
        </ul>
      }

      @if (showDropdown() && !loading() && query().length >= 3 && suggestions().length === 0) {
        <p class="absolute z-20 mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-500 shadow-lg">
          No airports found
        </p>
      }
    </div>
  `,
})
export class AirportAutocompleteComponent implements ControlValueAccessor {
  readonly label = input('Airport');
  readonly placeholder = input('Search city or airport code');

  private readonly airportService = inject(AirportService);
  private readonly search$ = new Subject<string>();

  readonly query = signal('');
  readonly displayText = signal('');
  readonly suggestions = signal<Airport[]>([]);
  readonly loading = signal(false);
  readonly showDropdown = signal(false);
  readonly isDisabled = signal(false);

  private selectedCode = '';
  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  constructor() {
    this.search$
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap((term) => {
          this.query.set(term);
          this.loading.set(term.trim().length >= 3);
        }),
        filter((term) => term.trim().length >= 3),
        switchMap((term) =>
          this.airportService.search(term).pipe(catchError(() => of([] as Airport[])))
        )
      )
      .subscribe((airports) => {
        this.suggestions.set(airports);
        this.loading.set(false);
        this.showDropdown.set(true);
      });
  }

  writeValue(code: string): void {
    const normalized = (code ?? '').trim().toUpperCase();
    this.selectedCode = normalized;
    if (!normalized) {
      this.displayText.set('');
      return;
    }
    if (normalized.length === 3) {
      this.resolveDisplayForCode(normalized);
      return;
    }
    this.displayText.set(normalized);
  }

  private resolveDisplayForCode(code: string): void {
    this.displayText.set(code);
    this.airportService.search(code).subscribe({
      next: (airports) => {
        const match = airports.find((a) => a.code.toUpperCase() === code) ?? airports[0];
        if (match && this.selectedCode === code) {
          this.displayText.set(`${match.city} (${match.code})`);
        }
      },
    });
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }

  onInputChange(value: string): void {
    this.displayText.set(value);
    this.selectedCode = '';
    this.onChange('');
    this.search$.next(value);
  }

  onFocus(): void {
    if (this.query().trim().length >= 3) {
      this.showDropdown.set(true);
    }
  }

  onBlur(): void {
    setTimeout(() => {
      this.showDropdown.set(false);
      this.onTouched();

      if (this.selectedCode) {
        const match = this.suggestions().find((a) => a.code === this.selectedCode);
        this.displayText.set(
          match ? `${match.city} (${match.code})` : this.selectedCode
        );
      }
    }, 150);
  }

  selectAirport(airport: Airport): void {
    this.selectedCode = airport.code;
    this.displayText.set(`${airport.city} (${airport.code})`);
    this.onChange(airport.code);
    this.showDropdown.set(false);
    this.suggestions.set([]);
  }
}
