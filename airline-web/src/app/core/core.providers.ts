import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { authInterceptor } from '../interceptors/auth.interceptor';
import { apiInterceptor } from '../interceptors/api.interceptor';

export function provideCore(): EnvironmentProviders {
  return makeEnvironmentProviders([
    provideHttpClient(withInterceptors([authInterceptor, apiInterceptor])),
  ]);
}
