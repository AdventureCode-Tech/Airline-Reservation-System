import { DatePipe, NgTemplateOutlet } from '@angular/common';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { BookingPriceSidebarComponent } from '../../components/booking/booking-price-sidebar/booking-price-sidebar.component';
import { BookingSectionComponent } from '../../components/booking/booking-section/booking-section.component';
import { FlightLegDetailsComponent } from '../../components/flight-card/flight-leg-details.component';
import { CardBrandLogoComponent } from '../../components/card-brand-logo/card-brand-logo.component';
import { ApiError } from '../../models';
import {
  birthYears,
  BookingPassenger,
  CANCELLATION_PROTECTION_PRICE,
  DAYS,
  expiryYears,
  GENDERS,
  MONTHS,
  PASSENGER_TITLES,
  TICKET_TIERS,
  TicketTierId,
  WEB_CHECKIN_PRICE,
} from '../../models/booking.model';
import { BookingService } from '../../services/booking.service';
import { FlightSearchStateService } from '../../services/flight-search-state.service';
import { formatCurrency } from '../../utils/currency.utils';
import { CurrencyFormatPipe } from '../../pipes/currency-format.pipe';
import {
  cardLastFour,
  cardValidationMessage,
  CardValidationError,
  cvvValidationMessage,
  detectCardBrand,
  expiryValidationMessage,
  formatCardNumber,
  getCardValidationError,
  getCvvValidationError,
  getExpiryValidationError,
} from '../../utils/payment.utils';

function cardNumberValidator(control: AbstractControl): ValidationErrors | null {
  const error = getCardValidationError((control.value as string) ?? '');
  return error ? { cardNumber: error } : null;
}

function cvvValidator(control: AbstractControl): ValidationErrors | null {
  const parent = control.parent;
  if (!parent) return null;
  const cardNumber = (parent.get('cardNumber')?.value as string) ?? '';
  const error = getCvvValidationError((control.value as string) ?? '', cardNumber);
  return error ? { cvv: error } : null;
}

function paymentGroupValidator(group: AbstractControl): ValidationErrors | null {
  const month = group.get('expirationMonth')?.value;
  const year = group.get('expirationYear')?.value;
  const error = getExpiryValidationError(month, year);
  return error ? { expiry: error } : null;
}

@Component({
  selector: 'app-review-booking',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    DatePipe,
    NgTemplateOutlet,
    BookingSectionComponent,
    BookingPriceSidebarComponent,
    FlightLegDetailsComponent,
    CardBrandLogoComponent,
    CurrencyFormatPipe,
  ],
  templateUrl: './review-booking.component.html',
})
export class ReviewBookingComponent {
  private readonly router = inject(Router);
  private readonly bookingService = inject(BookingService);
  readonly state = inject(FlightSearchStateService);

  readonly loading = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly expandedTsa = signal<Set<number>>(new Set());

  readonly ticketTiers = TICKET_TIERS;
  readonly passengerTitles = PASSENGER_TITLES;
  readonly genders = GENDERS;
  readonly months = MONTHS;
  readonly days = DAYS;
  readonly birthYears = birthYears();
  readonly expiryYears = expiryYears();
  readonly webCheckInPrice = WEB_CHECKIN_PRICE;
  readonly cancellationPrice = CANCELLATION_PROTECTION_PRICE;

  readonly bookingForm = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    phone: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(8)],
    }),
    ticketTier: new FormControl<TicketTierId>('basic', { nonNullable: true }),
    webCheckIn: new FormControl(false, { nonNullable: true }),
    cancellationProtection: new FormControl(false, { nonNullable: true }),
    passengers: new FormArray<FormGroup>([]),
    payment: new FormGroup(
      {
        cardNumber: new FormControl('', {
          nonNullable: true,
          validators: [cardNumberValidator],
        }),
        cardHolderName: new FormControl('', {
          nonNullable: true,
          validators: [Validators.required, Validators.minLength(2)],
        }),
        expirationMonth: new FormControl('', {
          nonNullable: true,
          validators: [Validators.required],
        }),
        expirationYear: new FormControl('', {
          nonNullable: true,
          validators: [Validators.required],
        }),
        cvv: new FormControl('', {
          nonNullable: true,
          validators: [cvvValidator],
        }),
      },
      { validators: [paymentGroupValidator] }
    ),
    billing: new FormGroup({
      streetAddress: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      aptSuite: new FormControl('', { nonNullable: true }),
      city: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      state: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      zipCode: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      country: new FormControl('United States', { nonNullable: true, validators: [Validators.required] }),
    }),
  });

  constructor() {
    if (!this.state.hasSelectedOffer() || !this.state.searchRequest()) {
      this.router.navigate(['/results']);
      return;
    }

    this.buildPassengerForms();
  }

  get passengers(): FormArray {
    return this.bookingForm.controls.passengers;
  }

  get passengerGroups(): FormGroup[] {
    return this.passengers.controls as FormGroup[];
  }

  get paymentForm(): FormGroup {
    return this.bookingForm.controls.payment;
  }

  get billingForm(): FormGroup {
    return this.bookingForm.controls.billing;
  }

  get selectedOffer() {
    return this.state.selectedOffer()!;
  }

  get searchRequest() {
    return this.state.searchRequest()!;
  }

  get adultCount(): number {
    return this.searchRequest.adults;
  }

  get currency(): string {
    return this.selectedOffer.currency;
  }

  get selectedTier() {
    const id = this.bookingForm.controls.ticketTier.value;
    return this.ticketTiers.find((tier) => tier.id === id) ?? this.ticketTiers[0];
  }

  get baseSubtotal(): number {
    return this.selectedOffer.totalPrice * this.adultCount;
  }

  get tierAddonTotal(): number {
    return this.selectedTier.pricePerAdult * this.adultCount;
  }

  get totalPrice(): number {
    let total = this.baseSubtotal + this.tierAddonTotal;
    if (this.bookingForm.controls.webCheckIn.value) {
      total += this.webCheckInPrice;
    }
    if (this.bookingForm.controls.cancellationProtection.value) {
      total += this.cancellationPrice;
    }
    return total;
  }

  get webCheckInSubtitle(): string {
    return formatCurrency(this.webCheckInPrice, this.currency);
  }

  get cancellationSubtitle(): string {
    return formatCurrency(this.cancellationPrice, this.currency);
  }

  get canSubmit(): boolean {
    return this.bookingForm.valid && !this.loading();
  }

  selectTier(tierId: TicketTierId): void {
    this.bookingForm.controls.ticketTier.setValue(tierId);
  }

  toggleTsa(index: number): void {
    this.expandedTsa.update((set) => {
      const next = new Set(set);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }

  isTsaExpanded(index: number): boolean {
    return this.expandedTsa().has(index);
  }

  onCardNumberInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const formatted = formatCardNumber(input.value);
    const control = this.paymentForm.controls['cardNumber'];
    control.setValue(formatted);
    control.markAsDirty();
    control.updateValueAndValidity();
    this.paymentForm.controls['cvv'].updateValueAndValidity();
    input.value = formatted;
  }

  onExpiryChange(): void {
    this.paymentForm.updateValueAndValidity();
  }

  activeCardBrand(): string {
    const digits = this.paymentForm.controls['cardNumber'].value.replace(/\D/g, '');
    return digits.length >= 2 ? detectCardBrand(digits) : 'Card';
  }

  cardNumberError(): string {
    const control = this.paymentForm.controls['cardNumber'];
    if (!control.touched && !control.dirty) return '';
    const code = control.errors?.['cardNumber'] as CardValidationError | undefined;
    return code ? cardValidationMessage(code) : '';
  }

  cvvError(): string {
    const control = this.paymentForm.controls['cvv'];
    if (!control.touched && !control.dirty) return '';
    const code = control.errors?.['cvv'] as 'required' | 'invalid' | undefined;
    return cvvValidationMessage(code ?? null, this.paymentForm.controls['cardNumber'].value);
  }

  expiryError(): string {
    const group = this.paymentForm;
    const monthTouched = group.controls['expirationMonth'].touched;
    const yearTouched = group.controls['expirationYear'].touched;
    if (!monthTouched && !yearTouched && !group.touched) return '';
    const code = group.errors?.['expiry'] as 'required' | 'expired' | undefined;
    return expiryValidationMessage(code ?? null);
  }

  detectCardBrand = detectCardBrand;

  confirmBooking(): void {
    this.bookingForm.markAllAsTouched();
    this.paymentForm.markAllAsTouched();

    if (this.bookingForm.invalid) {
      return;
    }

    const form = this.bookingForm.getRawValue();
    const cardDigits = form.payment.cardNumber.replace(/\s/g, '');
    const passengers: BookingPassenger[] = form.passengers.map((p) => ({
      title: p['title'] as string,
      firstName: p['firstName'] as string,
      middleName: p['middleName'] as string,
      lastName: p['lastName'] as string,
      gender: p['gender'] as string,
      dateOfBirthDay: Number(p['dateOfBirthDay']),
      dateOfBirthMonth: Number(p['dateOfBirthMonth']),
      dateOfBirthYear: Number(p['dateOfBirthYear']),
      tsaPrecheck: (p['tsaPrecheck'] as string) || undefined,
    }));

    const primary = passengers[0];
    const tierAddon = this.tierAddonTotal;
    const webCheckIn = form.webCheckIn;
    const cancellationProtection = form.cancellationProtection;

    this.loading.set(true);
    this.errorMessage.set(null);

    this.bookingService
      .create({
        email: form.email,
        phone: form.phone,
        origin: this.searchRequest.origin,
        destination: this.searchRequest.destination,
        departureDate: this.searchRequest.departureDate,
        returnDate: this.searchRequest.returnDate,
        offerId: this.selectedOffer.offerId,
        ticketTier: this.selectedTier.apiValue,
        ticketTierAddon: tierAddon,
        webCheckIn,
        webCheckInPrice: webCheckIn ? this.webCheckInPrice : 0,
        cancellationProtection,
        cancellationProtectionPrice: cancellationProtection ? this.cancellationPrice : 0,
        totalAmount: this.totalPrice,
        currency: this.currency,
        adults: this.adultCount,
        tripType: this.searchRequest.tripType ?? (this.searchRequest.returnDate ? 'RoundTrip' : 'OneWay'),
        cabinClass: this.searchRequest.cabinClass ?? 'Economy',
        basePricePerAdult: this.selectedOffer.totalPrice,
        outboundSegments: this.selectedOffer.outboundSegments.map((s) => ({
          flightNumber: s.flightNumber,
          airline: s.airline,
          carrierCode: s.carrierCode,
          origin: s.origin,
          destination: s.destination,
          departureTime: s.departureTime,
          arrivalTime: s.arrivalTime,
          durationMinutes: s.durationMinutes,
        })),
        returnSegments: this.selectedOffer.returnSegments.map((s) => ({
          flightNumber: s.flightNumber,
          airline: s.airline,
          carrierCode: s.carrierCode,
          origin: s.origin,
          destination: s.destination,
          departureTime: s.departureTime,
          arrivalTime: s.arrivalTime,
          durationMinutes: s.durationMinutes,
        })),
        passengers,
        payment: {
          cardLastFour: cardLastFour(cardDigits),
          cardHolderName: form.payment.cardHolderName,
          expirationMonth: String(form.payment.expirationMonth).padStart(2, '0'),
          expirationYear: String(form.payment.expirationYear),
          cardBrand: detectCardBrand(cardDigits),
        },
        billingAddress: form.billing,
      })
      .subscribe({
        next: (response) => {
          const segment = this.selectedOffer.outboundSegments[0];

          this.state.setBookingConfirmation({
            bookingReference: response.bookingReference,
            status: response.status,
            bookedAt: new Date().toISOString(),
            email: form.email,
            phone: form.phone,
            passengerName: `${primary.firstName} ${primary.lastName}`.trim(),
            passengers: passengers.map((p) => ({
              fullName: [p.title, p.firstName, p.middleName, p.lastName].filter(Boolean).join(' ').replace(/\s+/g, ' ').trim(),
              type: 'Adult',
            })),
            origin: this.searchRequest.origin,
            destination: this.searchRequest.destination,
            departureDate: this.searchRequest.departureDate,
            returnDate: this.searchRequest.returnDate,
            tripType: this.searchRequest.tripType ?? (this.searchRequest.returnDate ? 'RoundTrip' : 'OneWay'),
            cabinClass: this.searchRequest.cabinClass ?? 'Economy',
            adults: this.adultCount,
            totalPrice: this.totalPrice,
            currency: this.currency,
            basePricePerAdult: this.selectedOffer.totalPrice,
            airline: segment?.airline ?? '',
            flightNumber: segment?.flightNumber ?? '',
            ticketTier: this.selectedTier.name,
            ticketTierAddon: tierAddon,
            webCheckIn,
            webCheckInPrice: webCheckIn ? this.webCheckInPrice : 0,
            cancellationProtection,
            cancellationProtectionPrice: cancellationProtection ? this.cancellationPrice : 0,
            outboundSegments: [...this.selectedOffer.outboundSegments],
            returnSegments: [...this.selectedOffer.returnSegments],
            paymentLastFour: cardLastFour(cardDigits),
            paymentCardBrand: detectCardBrand(cardDigits),
            paymentCardHolder: form.payment.cardHolderName,
          });

          this.loading.set(false);
          this.router.navigate(['/booking/success']);
        },
        error: (error: ApiError) => {
          this.errorMessage.set(error.message);
          this.loading.set(false);
        },
      });
  }

  private buildPassengerForms(): void {
    for (let i = 0; i < this.adultCount; i++) {
      this.passengers.push(
        new FormGroup({
          title: new FormControl('Mr', { nonNullable: true, validators: [Validators.required] }),
          firstName: new FormControl('', {
            nonNullable: true,
            validators: [Validators.required, Validators.minLength(2)],
          }),
          middleName: new FormControl('', { nonNullable: true }),
          lastName: new FormControl('', {
            nonNullable: true,
            validators: [Validators.required, Validators.minLength(2)],
          }),
          gender: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
          dateOfBirthDay: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
          dateOfBirthMonth: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
          dateOfBirthYear: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
          tsaPrecheck: new FormControl('', { nonNullable: true }),
        })
      );
    }
  }
}
