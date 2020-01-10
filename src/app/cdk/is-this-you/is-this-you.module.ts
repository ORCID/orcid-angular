import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { IsThisYouComponent } from './is-this-you.component'
import { MatButtonModule, MatDialogModule } from '@angular/material'
import { PlatformInfoModule } from '../platform-info'
import { WindowModule } from '../window'

@NgModule({
  declarations: [IsThisYouComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    PlatformInfoModule,
    WindowModule,
    MatDialogModule,
  ],
  exports: [IsThisYouComponent],
})
export class IsThisYouModule {}
