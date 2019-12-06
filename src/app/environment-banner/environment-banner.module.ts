import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { EnvironmentBannerComponent } from './environment-banner/environment-banner.component'
import { EnvironmentRoutingModule } from './environment-banner-routing.module'

@NgModule({
  exports: [EnvironmentBannerComponent],
  declarations: [EnvironmentBannerComponent],
  imports: [CommonModule, EnvironmentRoutingModule],
})
export class EnvironmentBannerModule {}
