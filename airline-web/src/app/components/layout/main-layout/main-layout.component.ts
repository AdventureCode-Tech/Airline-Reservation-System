import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { SiteFooterComponent } from '../site-footer/site-footer.component';
import { SiteHeaderComponent } from '../site-header/site-header.component';

@Component({
  selector: 'app-main-layout',
  imports: [SiteHeaderComponent, SiteFooterComponent, RouterOutlet],
  template: `
    <div class="flex min-h-screen flex-col">
      <app-site-header />
      <main class="flex-1">
        <router-outlet />
      </main>
      <app-site-footer />
    </div>
  `,
})
export class MainLayoutComponent {}
