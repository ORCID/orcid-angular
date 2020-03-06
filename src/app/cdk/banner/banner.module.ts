import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { BannerComponent } from './banner.component'
import { MatButtonModule } from '@angular/material'

@NgModule({
  declarations: [BannerComponent],
  imports: [CommonModule, MatButtonModule],
  exports: [BannerComponent],
})
export class BannerModule {}
