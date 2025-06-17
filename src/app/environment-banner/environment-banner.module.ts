import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { EnvironmentBannerComponent } from './environment-banner/environment-banner.component'
import { EnvironmentRoutingModule } from './environment-banner-routing.module'
import { MatButtonModule } from '@angular/material/button'

@NgModule({
  exports: [EnvironmentBannerComponent],
  declarations: [EnvironmentBannerComponent],
  imports: [CommonModule, EnvironmentRoutingModule, MatButtonModule],
})
export class EnvironmentBannerModule {}
