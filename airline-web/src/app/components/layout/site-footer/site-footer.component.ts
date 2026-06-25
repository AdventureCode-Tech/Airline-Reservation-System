import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { CardBrandLogoComponent } from '../../card-brand-logo/card-brand-logo.component';
import { SITE } from '../../../core/site.constants';
import { ApiError } from '../../../models';
import { InquiryService } from '../../../services/inquiry.service';

@Component({
  selector: 'app-site-footer',
  imports: [RouterLink, FormsModule, CardBrandLogoComponent],
  templateUrl: './site-footer.component.html',
})
export class SiteFooterComponent {
  private readonly inquiryService = inject(InquiryService);

  readonly site = SITE;
  readonly newsletterEmail = signal('');
  readonly newsletterLoading = signal(false);
  readonly newsletterSuccess = signal<string | null>(null);
  readonly newsletterError = signal<string | null>(null);

  readonly services = [
    'Flights', 'Hotels', 'Car Rental', 'Trains',
    'Cruises', 'Vacation Packages', 'Private Jets',
  ];

  readonly quickLinks = [
    { label: 'About Us', route: '/about' },
    { label: 'Contact', route: '/contact' },
    { label: 'Blog', route: '/blog' },
    { label: 'FAQ', route: '/#faq' },
  ];

  readonly legalLinks = [
    'Terms & Conditions', 'Privacy Policy', 'Cookie Policy', 'Refund Policy',
  ];

  readonly paymentMethods = ['Visa', 'Mastercard', 'Amex', 'PayPal'];

  onSubscribe(): void {
    const email = this.newsletterEmail().trim();
    if (!email || this.newsletterLoading()) {
      this.newsletterError.set('Please enter a valid email address.');
      return;
    }

    this.newsletterLoading.set(true);
    this.newsletterSuccess.set(null);
    this.newsletterError.set(null);

    this.inquiryService.subscribeNewsletter({ email }).subscribe({
      next: () => {
        this.newsletterLoading.set(false);
        this.newsletterSuccess.set('Thank you for subscribing! Check your inbox for exclusive deals.');
        this.newsletterEmail.set('');
      },
      error: (error: ApiError) => {
        this.newsletterLoading.set(false);
        this.newsletterError.set(error.message);
      },
    });
  }
}
