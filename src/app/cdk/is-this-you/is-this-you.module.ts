import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { IsThisYouComponent } from './is-this-you.component'
import { PlatformInfoModule } from '../platform-info'
import { WindowModule } from '../window'
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button'
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog'
import { RouterModule } from '@angular/router'

@NgModule({
  declarations: [IsThisYouComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    PlatformInfoModule,
    WindowModule,
    MatDialogModule,
    RouterModule,
  ],
  exports: [IsThisYouComponent],
})
export class IsThisYouModule {}
