import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'results',
    loadComponent: () =>
      import('./pages/search-results/search-results.component').then(
        (m) => m.SearchResultsComponent
      ),
  },
  {
    path: 'booking/review',
    loadComponent: () =>
      import('./pages/review-booking/review-booking.component').then(
        (m) => m.ReviewBookingComponent
      ),
  },
  {
    path: 'booking/success',
    loadComponent: () =>
      import('./pages/booking-success/booking-success.component').then(
        (m) => m.BookingSuccessComponent
      ),
  },
  {
    path: 'about',
    loadComponent: () =>
      import('./pages/about/about.component').then((m) => m.AboutComponent),
  },
  {
    path: 'contact',
    loadComponent: () =>
      import('./pages/contact/contact.component').then((m) => m.ContactComponent),
  },
  {
    path: 'blog',
    loadComponent: () =>
      import('./pages/blog/blog.component').then((m) => m.BlogComponent),
  },
  {
    path: 'flights',
    loadChildren: () =>
      import('./pages/flights/flights.routes').then((m) => m.FLIGHTS_ROUTES),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
