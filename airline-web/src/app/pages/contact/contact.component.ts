import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { SITE } from '../../core/site.constants';
import { ApiError } from '../../models';
import { CONTACT_SUBJECTS } from '../../models/inquiry.model';
import { InquiryService } from '../../services/inquiry.service';

@Component({
  selector: 'app-contact',
  imports: [ReactiveFormsModule],
  templateUrl: './contact.component.html',
})
export class ContactComponent {
  private readonly inquiryService = inject(InquiryService);

  readonly site = SITE;
  readonly subjects = CONTACT_SUBJECTS;
  readonly loading = signal(false);
  readonly successMessage = signal<string | null>(null);
  readonly errorMessage = signal<string | null>(null);

  readonly contactForm = new FormGroup({
    firstName: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(2)] }),
    lastName: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(2)] }),
    email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    phone: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(8)] }),
    subject: new FormControl('General Inquiry', { nonNullable: true, validators: [Validators.required] }),
    message: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(10)],
    }),
  });

  submitContact(): void {
    this.contactForm.markAllAsTouched();
    if (this.contactForm.invalid || this.loading()) {
      return;
    }

    this.loading.set(true);
    this.successMessage.set(null);
    this.errorMessage.set(null);

    const form = this.contactForm.getRawValue();
    this.inquiryService.submitContact(form).subscribe({
      next: () => {
        this.loading.set(false);
        this.successMessage.set('Your message has been sent. We will get back to you within 24 hours.');
        this.contactForm.reset({ subject: 'General Inquiry' });
      },
      error: (error: ApiError) => {
        this.loading.set(false);
        this.errorMessage.set(error.message);
      },
    });
  }
}
