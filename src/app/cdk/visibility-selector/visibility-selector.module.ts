import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { VisibilitySelectorComponent } from './visibility-selector/visibility-selector.component'
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button'
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu'
import { MatIconModule } from '@angular/material/icon'

@NgModule({
  declarations: [VisibilitySelectorComponent],
  imports: [CommonModule, MatButtonModule, MatMenuModule, MatIconModule],
  exports: [VisibilitySelectorComponent],
})
export class VisibilitySelectorModule {}
