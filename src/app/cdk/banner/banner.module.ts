import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { BannerComponent } from './banner.component'
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button'

@NgModule({
  declarations: [BannerComponent],
  imports: [CommonModule, MatButtonModule],
  exports: [BannerComponent],
})
export class BannerModule {}
