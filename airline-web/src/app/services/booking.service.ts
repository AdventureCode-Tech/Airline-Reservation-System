import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { BookingRequest, BookingResponse } from '../models';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class BookingService {
  private readonly api = inject(ApiService);

  create(request: BookingRequest): Observable<BookingResponse> {
    return this.api.post<BookingResponse, BookingRequest>('/bookings', request);
  }
}
