import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { VisibilitySelectorComponent } from './visibility-selector/visibility-selector.component'
import { MatButtonModule } from '@angular/material/button'
import { MatMenuModule } from '@angular/material/menu'
import { MatIconModule } from '@angular/material/icon'

@NgModule({
  declarations: [VisibilitySelectorComponent],
  imports: [CommonModule, MatButtonModule, MatMenuModule, MatIconModule],
  exports: [VisibilitySelectorComponent],
})
export class VisibilitySelectorModule {}
