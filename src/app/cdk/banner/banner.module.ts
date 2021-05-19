import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { BannerComponent } from './banner.component'
import { MatButtonModule } from '@angular/material/button'

@NgModule({
  declarations: [BannerComponent],
  imports: [CommonModule, MatButtonModule],
  exports: [BannerComponent],
})
export class BannerModule {}
