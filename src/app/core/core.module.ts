import { HttpClientModule, HttpClientXsrfModule } from '@angular/common/http'
import { NgModule } from '@angular/core'
import { CookieService } from 'ngx-cookie-service'

import { TogglzDirective } from './togglz/togglz.directive'
import { PlatformInfoModule } from '../cdk/platform-info'
import { WindowModule } from '../cdk/window'

@NgModule({
  imports: [
    HttpClientModule,
    PlatformInfoModule,
    HttpClientXsrfModule,
    WindowModule,
  ],
  declarations: [TogglzDirective], // Should only export globally used directives.
  providers: [CookieService],
  exports: [TogglzDirective],
})
export class CoreModule {}
