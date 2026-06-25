import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiResponse } from '../models';
import { ContactFormRequest, NewsletterSubscribeRequest } from '../models/inquiry.model';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class InquiryService {
  private readonly api = inject(ApiService);

  subscribeNewsletter(request: NewsletterSubscribeRequest): Observable<ApiResponse<{ subscribed: boolean }>> {
    return this.api.post<ApiResponse<{ subscribed: boolean }>, NewsletterSubscribeRequest>(
      '/inquiries/newsletter',
      request
    );
  }

  submitContact(request: ContactFormRequest): Observable<ApiResponse<{ submitted: boolean }>> {
    return this.api.post<ApiResponse<{ submitted: boolean }>, ContactFormRequest>(
      '/inquiries/contact',
      request
    );
  }
}
