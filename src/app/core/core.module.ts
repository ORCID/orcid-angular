import { CommonModule } from '@angular/common'
import { HttpClientModule } from '@angular/common/http'
import { NgModule } from '@angular/core'
import { WINDOW_PROVIDERS } from './window/window.service'

@NgModule({
  imports: [CommonModule, HttpClientModule],
  declarations: [], // Should not declare anything
  providers: [WINDOW_PROVIDERS],
})
export class CoreModule {}
