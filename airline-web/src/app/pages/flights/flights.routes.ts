import { Routes } from '@angular/router';

import { authGuard } from '../../guards/auth.guard';

export const FLIGHTS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./flights.component').then((m) => m.FlightsComponent),
    canActivate: [authGuard],
  },
];
