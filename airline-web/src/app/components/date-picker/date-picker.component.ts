import {
  Component,
  forwardRef,
  inject,
  input,
  signal,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';

@Component({
  selector: 'app-date-picker',
  imports: [FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatePickerComponent),
      multi: true,
    },
  ],
  templateUrl: './date-picker.component.html',
})
export class DatePickerComponent implements ControlValueAccessor {
  readonly label = input('Date');
  readonly placeholder = input('Select date');
  readonly minDate = input<string>('');

  readonly displayMonth = signal(new Date());
  readonly selectedDate = signal<string>('');
  readonly isOpen = signal(false);
  readonly isDisabled = signal(false);

  readonly weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  get monthLabel(): string {
    const d = this.displayMonth();
    return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  }

  get calendarDays(): { date: Date; inMonth: boolean; iso: string; disabled: boolean }[] {
    const current = this.displayMonth();
    const year = current.getFullYear();
    const month = current.getMonth();
    const first = new Date(year, month, 1);
    const startOffset = (first.getDay() + 6) % 7;
    const start = new Date(year, month, 1 - startOffset);
    const min = this.minDate();

    return Array.from({ length: 42 }, (_, i) => {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      const iso = this.toIso(date);
      return {
        date,
        inMonth: date.getMonth() === month,
        iso,
        disabled: !!min && iso < min,
      };
    });
  }

  writeValue(value: string): void {
    this.selectedDate.set(value ?? '');
    if (value) {
      const [y, m] = value.split('-').map(Number);
      this.displayMonth.set(new Date(y, m - 1, 1));
    }
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

  toggle(): void {
    if (this.isDisabled()) return;
    this.isOpen.update((v) => !v);
  }

  close(): void {
    this.isOpen.set(false);
    this.onTouched();
  }

  prevMonth(): void {
    const d = this.displayMonth();
    this.displayMonth.set(new Date(d.getFullYear(), d.getMonth() - 1, 1));
  }

  nextMonth(): void {
    const d = this.displayMonth();
    this.displayMonth.set(new Date(d.getFullYear(), d.getMonth() + 1, 1));
  }

  selectDay(iso: string, disabled: boolean): void {
    if (disabled) return;
    this.selectedDate.set(iso);
    this.onChange(iso);
    this.close();
  }

  displayValue(): string {
    const val = this.selectedDate();
    if (!val) return '';
    const [y, m, d] = val.split('-').map(Number);
    return new Date(y, m - 1, d).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }

  isSelected(iso: string): boolean {
    return this.selectedDate() === iso;
  }

  private toIso(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
}
