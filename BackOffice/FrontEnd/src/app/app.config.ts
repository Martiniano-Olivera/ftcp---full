import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideClientHydration } from '@angular/platform-browser';

import { routes } from './app.routes';
import { jwtInterceptor } from './core/interceptors/jwt.interceptor';
import { errorInterceptor } from './core/interceptors/error.interceptor';
import { loadingInterceptor } from './core/interceptors/loading.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([
        jwtInterceptor,
        errorInterceptor,
        loadingInterceptor
      ])
    ),
    provideAnimations(),
    provideClientHydration()
  ]
};
