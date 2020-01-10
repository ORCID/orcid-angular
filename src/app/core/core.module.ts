import { HttpClientModule, HttpClientXsrfModule } from '@angular/common/http'
import { NgModule } from '@angular/core'
import { CookieService } from 'ngx-cookie-service'

import { WINDOW_PROVIDERS } from '../cdk/window/window.service'
import { TogglzDirective } from './togglz/togglz.directive'
import { PlatformInfoModule } from '../cdk/platform-info'

@NgModule({
  imports: [HttpClientModule, PlatformInfoModule, HttpClientXsrfModule],
  declarations: [TogglzDirective], // Should only export globally used directives.
  providers: [WINDOW_PROVIDERS, CookieService],
  exports: [TogglzDirective],
})
export class CoreModule {}
