import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { TrimDirective } from './trim.directive'

@NgModule({
  declarations: [TrimDirective],
  imports: [CommonModule],
  exports: [TrimDirective],
})
export class FormDirectivesModule {}
