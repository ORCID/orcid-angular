import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { IsThisYouComponent } from './is-this-you.component'
import { PlatformInfoModule } from '../platform-info'
import { WindowModule } from '../window'
import { MatButtonModule } from '@angular/material/button'
import { MatDialogModule } from '@angular/material/dialog'

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
