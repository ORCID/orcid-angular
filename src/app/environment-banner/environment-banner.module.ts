import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { EnvironmentBannerComponent } from './environment-banner/environment-banner.component'

@NgModule({
  exports: [EnvironmentBannerComponent],
  declarations: [EnvironmentBannerComponent],
  imports: [CommonModule],
})
export class EnvironmentBannerModule {}
