import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { EnvironmentBannerModule } from '../app/environment-banner/environment-banner.module'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { CoreModule } from './core/core.module'
import { LayoutModule } from './layout/layout.module'
import { BidiModule } from '@angular/cdk/bidi'
import { PseudoModule } from 'src/locale/i18n.pseudo.component'
import { TitleService } from './core/title-service/title.service'
import { HttpContentTypeHeaderInterceptor } from './core/http-content-type-header-interceptor/http-content-type-header-interceptor'
import { XsrfFallbackInterceptor } from './core/xsrf/xsrf-fallback.interceptor'
import { FirefoxXsrfPreloadInterceptor } from './core/lang-preload/firefox-xsrf-preload.interceptor'
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptorsFromDi,
  withXsrfConfiguration,
} from '@angular/common/http'
import { MatDialogModule } from '@angular/material/dialog'
import { MatAutocompleteModule } from '@angular/material/autocomplete'
import { MatSelectModule } from '@angular/material/select'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { FormsModule } from '@angular/forms'

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CoreModule,
    BrowserAnimationsModule,
    LayoutModule,
    BidiModule,
    MatDialogModule,
    MatAutocompleteModule,
    MatSelectModule,
    MatInputModule,
    PseudoModule, // Remove on angular 10 https://bit.ly/3ezbF4v
    // Environmental dependent modules
    EnvironmentBannerModule,
    FormsModule,
  ],
  providers: [
    TitleService,
    // Firefox-only workaround to ensure XSRF cookie is established before backend calls
    {
      provide: HTTP_INTERCEPTORS,
      useClass: FirefoxXsrfPreloadInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpContentTypeHeaderInterceptor,
      multi: true,
    },
    // Fallback XSRF interceptor to ensure x-xsrf-token is present
    // when using local proxy / same-origin dev setups.
    {
      provide: HTTP_INTERCEPTORS,
      useClass: XsrfFallbackInterceptor,
      multi: true,
    },
    provideHttpClient(
      withInterceptorsFromDi(),
      withXsrfConfiguration({
        cookieName: 'XSRF-TOKEN',
        headerName: 'x-xsrf-token',
      })
    ),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
