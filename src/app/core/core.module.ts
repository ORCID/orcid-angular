import { HttpClientModule, HttpClientXsrfModule } from '@angular/common/http'
import { NgModule } from '@angular/core'
import { CookieService } from 'ngx-cookie-service'
import { TogglzDirective } from './togglz/togglz.directive'
import { PlatformInfoModule } from '../cdk/platform-info'
import { WindowModule, WINDOW_PROVIDERS } from '../cdk/window'
import { MatPaginatorIntlImplementation } from './paginator/matPaginator.service'
import { MatPaginatorIntl } from '@angular/material/paginator'

@NgModule({
  imports: [
    HttpClientModule,
    PlatformInfoModule,
    HttpClientXsrfModule,
    WindowModule,
  ],
  declarations: [TogglzDirective], // Should only export globally used directives.
  providers: [
    WINDOW_PROVIDERS,
    CookieService,
    { provide: MatPaginatorIntl, useClass: MatPaginatorIntlImplementation },
  ],
  exports: [TogglzDirective],
})
export class CoreModule {}
