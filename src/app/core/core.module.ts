import { NgModule } from '@angular/core'
import { TogglzDirective } from './togglz/togglz.directive'
import { PlatformInfoModule } from '../cdk/platform-info'
import { WindowModule, WINDOW_PROVIDERS } from '../cdk/window'
import { MatPaginatorIntlImplementation } from './paginator/matPaginator.service'
import { MatPaginatorIntl } from '@angular/material/paginator'
import { SnackbarModule } from '../cdk/snackbar/snackbar.module'

@NgModule({
  imports: [PlatformInfoModule, WindowModule, SnackbarModule],
  declarations: [TogglzDirective], // Should only export globally used directives.
  providers: [
    WINDOW_PROVIDERS,
    { provide: MatPaginatorIntl, useClass: MatPaginatorIntlImplementation },
  ],
  exports: [TogglzDirective],
})
export class CoreModule {}
