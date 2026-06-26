import { Component, inject, input, OnInit, output, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { AirportAutocompleteComponent } from '../../airport-autocomplete/airport-autocomplete.component';
import { DatePickerComponent } from '../../date-picker/date-picker.component';
import { ApiError, CabinClass, FlightSearchRequest, TripType } from '../../../models';
import { FlightSearchStateService } from '../../../services/flight-search-state.service';
import { FlightService } from '../../../services/flight.service';

@Component({
  selector: 'app-edit-search-panel',
  imports: [ReactiveFormsModule, AirportAutocompleteComponent, DatePickerComponent],
  templateUrl: './edit-search-panel.component.html',
})
export class EditSearchPanelComponent implements OnInit {
  private readonly flightService = inject(FlightService);
  private readonly searchState = inject(FlightSearchStateService);

  readonly request = input.required<FlightSearchRequest>();
  readonly close = output<void>();
  readonly searched = output<void>();

  readonly loading = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly showTravellers = signal(false);

  readonly tripTypes: { value: TripType; label: string }[] = [
    { value: 'RoundTrip', label: 'Round Trip' },
    { value: 'OneWay', label: 'One Way' },
  ];

  readonly cabinClasses: { value: CabinClass; label: string }[] = [
    { value: 'Economy', label: 'Economy' },
    { value: 'PremiumEconomy', label: 'Premium Economy' },
    { value: 'Business', label: 'Business' },
    { value: 'First', label: 'First Class' },
  ];

  readonly travellerRows: { field: 'adults' | 'children' | 'infants'; label: string }[] = [
    { field: 'adults', label: 'Adults' },
    { field: 'children', label: 'Children' },
    { field: 'infants', label: 'Infants' },
  ];

  readonly minDate = this.formatDate(new Date());

  readonly searchForm = new FormGroup({
    tripType: new FormControl<TripType>('OneWay', { nonNullable: true }),
    origin: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(3), Validators.maxLength(3)],
    }),
    destination: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(3), Validators.maxLength(3)],
    }),
    departureDate: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    returnDate: new FormControl({ value: '', disabled: true }),
    adults: new FormControl(1, { nonNullable: true, validators: [Validators.min(1), Validators.max(9)] }),
    children: new FormControl(0, { nonNullable: true, validators: [Validators.min(0), Validators.max(9)] }),
    infants: new FormControl(0, { nonNullable: true, validators: [Validators.min(0), Validators.max(9)] }),
    cabinClass: new FormControl<CabinClass>('Economy', { nonNullable: true }),
  });

  ngOnInit(): void {
    this.patchFromRequest(this.request());
  }

  get isRoundTrip(): boolean {
    return this.searchForm.controls.tripType.value === 'RoundTrip';
  }

  get returnMinDate(): string {
    return this.searchForm.controls.departureDate.value || this.minDate;
  }

  get travellerSummary(): string {
    const { adults, children, infants } = this.searchForm.getRawValue();
    const total = adults + children + infants;
    return `${total} ${total === 1 ? 'Adult' : 'Adults'}${children > 0 ? `, ${children} Child${children === 1 ? '' : 'ren'}` : ''}${infants > 0 ? `, ${infants} Infant${infants === 1 ? '' : 's'}` : ''}`;
  }

  setTripType(tripType: TripType): void {
    this.searchForm.controls.tripType.setValue(tripType);
    const returnControl = this.searchForm.controls.returnDate;
    if (tripType === 'OneWay') {
      returnControl.setValue('');
      returnControl.clearValidators();
      returnControl.disable();
    } else {
      returnControl.setValidators([Validators.required]);
      returnControl.enable();
    }
    returnControl.updateValueAndValidity();
  }

  swapAirports(): void {
    const origin = this.searchForm.controls.origin.value;
    const destination = this.searchForm.controls.destination.value;
    this.searchForm.patchValue({ origin: destination, destination: origin });
  }

  toggleTravellers(): void {
    this.showTravellers.update((v) => !v);
  }

  closeTravellers(): void {
    this.showTravellers.set(false);
  }

  adjustTravellers(field: 'adults' | 'children' | 'infants', delta: number): void {
    const control = this.searchForm.controls[field];
    control.setValue(Math.min(9, Math.max(field === 'adults' ? 1 : 0, control.value + delta)));
  }

  onSearch(): void {
    if (this.searchForm.invalid) {
      this.searchForm.markAllAsTouched();
      return;
    }

    const form = this.searchForm.getRawValue();
    const request: FlightSearchRequest = {
      origin: form.origin.toUpperCase(),
      destination: form.destination.toUpperCase(),
      departureDate: form.departureDate,
      returnDate: this.isRoundTrip ? (form.returnDate ?? undefined) : undefined,
      adults: form.adults,
      children: form.children,
      infants: form.infants,
      tripType: form.tripType,
      cabinClass: form.cabinClass,
    };

    this.loading.set(true);
    this.errorMessage.set(null);

    this.flightService.search(request).subscribe({
      next: (response) => {
        this.searchState.setSearchResults(request, response);
        this.loading.set(false);
        this.searched.emit();
      },
      error: (error: ApiError) => {
        this.errorMessage.set(error.message);
        this.loading.set(false);
      },
    });
  }

  private patchFromRequest(req: FlightSearchRequest): void {
    const tripType = req.tripType ?? (req.returnDate ? 'RoundTrip' : 'OneWay');
    this.searchForm.patchValue({
      tripType,
      origin: req.origin,
      destination: req.destination,
      departureDate: req.departureDate,
      returnDate: req.returnDate ?? '',
      adults: req.adults,
      children: req.children ?? 0,
      infants: req.infants ?? 0,
      cabinClass: req.cabinClass ?? 'Economy',
    });
    this.setTripType(tripType);
  }

  private formatDate(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
}
