import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { en_US, provideNzI18n } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { FormsModule } from '@angular/forms';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient } from '@angular/common/http';
import { provideAuth0 } from '@auth0/auth0-angular';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

registerLocaleData(en);

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideNzI18n(en_US),
    importProvidersFrom(FormsModule),
    provideAnimationsAsync(),
    provideAuth0({
      domain: 'dev-5j1t4i3az126kyut.us.auth0.com',
      clientId: '9ktqGu835jAPuqxjeWdZP5n15rK61vVx',
      authorizationParams: {
        redirect_uri: window.location.origin,
      },
      cacheLocation: 'localstorage',
    }),
    provideHttpClient(),
    importProvidersFrom(
      provideFirebaseApp(() =>
        initializeApp({
          projectId: 'escapepursuit-8312c',
          appId: '1:1063620420295:web:9a79db364cce91233554e2',
          storageBucket: 'escapepursuit-8312c.appspot.com',
          apiKey: 'AIzaSyCqhGSsh7vV6rLLRogL9VUSPvuZTrNhMfY',
          authDomain: 'escapepursuit-8312c.firebaseapp.com',
          messagingSenderId: '1063620420295',
        })
      )
    ),
    importProvidersFrom(provideFirestore(() => getFirestore())),
  ],
};
