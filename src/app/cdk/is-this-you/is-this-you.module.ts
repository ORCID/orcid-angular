import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { IsThisYouComponent } from './is-this-you.component'
import { MatButtonModule } from '@angular/material'
import { PlatformInfoModule } from '../platform-info'

@NgModule({
  declarations: [IsThisYouComponent],
  imports: [CommonModule, MatButtonModule, PlatformInfoModule],
  exports: [IsThisYouComponent],
})
export class IsThisYouModule {}
