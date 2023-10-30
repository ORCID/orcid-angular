import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { EnvironmentBannerComponent } from './environment-banner/environment-banner.component'
import { EnvironmentRoutingModule } from './environment-banner-routing.module'
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button'

@NgModule({
  exports: [EnvironmentBannerComponent],
  declarations: [EnvironmentBannerComponent],
  imports: [CommonModule, EnvironmentRoutingModule, MatButtonModule],
})
export class EnvironmentBannerModule {}
