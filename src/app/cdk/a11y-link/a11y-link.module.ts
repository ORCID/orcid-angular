import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { A11yLinkDirective } from './a11y-link.directive'

@NgModule({
  declarations: [A11yLinkDirective],
  imports: [CommonModule],
  exports: [A11yLinkDirective],
})
export class A11yLinkModule {}
