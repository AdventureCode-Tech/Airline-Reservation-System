import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { SITE } from '../../../core/site.constants';

@Component({
  selector: 'app-site-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './site-header.component.html',
})
export class SiteHeaderComponent {
  readonly site = SITE;
  readonly mobileMenuOpen = signal(false);

  readonly navLinks = [
    { label: 'Home', route: '/' },
    { label: 'Blog', route: '/blog' },
    { label: 'About', route: '/about' },
    { label: 'Contact', route: '/contact' },
  ];

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update((open) => !open);
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }
}
