import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { FlightResults, FlightSearchRequest } from '../models';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class FlightService {
  private readonly api = inject(ApiService);

  search(request: FlightSearchRequest): Observable<FlightResults> {
    return this.api.post<FlightResults, FlightSearchRequest>('/flights/search', request);
  }
}
