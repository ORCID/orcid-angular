import { HttpClientModule } from '@angular/common/http'
import { NgModule } from '@angular/core'

import { WINDOW_PROVIDERS } from './window/window.service'
import { TogglzDirective } from './togglz/togglz.directive'

@NgModule({
  imports: [HttpClientModule],
  declarations: [TogglzDirective], // Should only export globally used directives.
  providers: [WINDOW_PROVIDERS],
  exports: [TogglzDirective],
})
export class CoreModule {}
