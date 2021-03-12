import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { PrivacySelectorComponent } from './privacy-selector/privacy-selector.component'
import { MatIcon, MatIconModule } from '@angular/material/icon'
import { MatButtonModule } from '@angular/material/button'

@NgModule({
  declarations: [PrivacySelectorComponent],
  imports: [CommonModule, MatIconModule, MatButtonModule],
  exports: [PrivacySelectorComponent],
})
export class PrivacySelectorModule {}
