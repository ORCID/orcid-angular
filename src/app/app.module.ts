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

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CoreModule,
    BrowserAnimationsModule,
    LayoutModule,
    BidiModule,
    // Environmental dependent modules
    environment.SHOW_TEST_WARNING_BANNER ? EnvironmentBannerModule : [],
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
