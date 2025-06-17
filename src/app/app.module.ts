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
import { HTTP_INTERCEPTORS } from '@angular/common/http'
import { MatLegacyDialogModule } from '@angular/material/legacy-dialog'
import { MatAutocompleteModule } from '@angular/material/autocomplete'
import {
  MatLegacyAutocompleteModule,
  MatLegacyAutocompleteSelectedEvent,
} from '@angular/material/legacy-autocomplete'
import { MatLegacySelectModule } from '@angular/material/legacy-select'
import { MatLegacyFormFieldModule } from '@angular/material/legacy-form-field'
import { MatLegacyInputModule } from '@angular/material/legacy-input'
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
    MatLegacyDialogModule,
    MatLegacyAutocompleteModule,
    MatLegacySelectModule,
    MatLegacyInputModule,
    PseudoModule, // Remove on angular 10 https://bit.ly/3ezbF4v
    // Environmental dependent modules
    EnvironmentBannerModule,
    FormsModule,
  ],
  providers: [
    TitleService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpContentTypeHeaderInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
