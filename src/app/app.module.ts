import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { environment } from 'src/environments/environment'
import { EnvironmentBannerModule } from '../app/environment-banner/environment-banner.module'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { CoreModule } from './core/core.module'
import { LayoutModule } from './layout/layout.module'
import { BidiModule } from '@angular/cdk/bidi'
import { PseudoModule } from 'src/locale/i18n.pseudo.component'

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CoreModule,
    BrowserAnimationsModule,
    LayoutModule,
    BidiModule,
    PseudoModule, // Remove on angular 10 https://bit.ly/3ezbF4v
    // Environmental dependent modules
    environment.SHOW_TEST_WARNING_BANNER ? EnvironmentBannerModule : [],
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor() {
    this.initializeApp()
  }

  private initializeApp() {
    environment.BASE_URL = this.getCurrentDomain()
  }

  getCurrentDomain() {
    const port = window.location.port ? ':' + window.location.port : ''
    return '//' + window.location.hostname + port + '/'
  }
}
