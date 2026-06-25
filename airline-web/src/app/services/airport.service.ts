import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';

import { Airport } from '../models';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class AirportService {
  private readonly api = inject(ApiService);

  search(query: string): Observable<Airport[]> {
    const trimmed = query.trim();

    if (trimmed.length < 3) {
      return of([]);
    }

    return this.api.get<Airport[]>(`/airports?q=${encodeURIComponent(trimmed)}`);
  }
}
