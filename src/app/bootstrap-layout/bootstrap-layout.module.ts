import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { BootstrapFooterComponent } from './bootstrap-footer/bootstrap-footer.component'
import { BootstrapHeaderComponent } from './bootstrap-header/bootstrap-header.component'
import { NgbModule } from '@ng-bootstrap/ng-bootstrap'

@NgModule({
  imports: [CommonModule, NgbModule],
  declarations: [BootstrapFooterComponent, BootstrapHeaderComponent],
  exports: [BootstrapFooterComponent, BootstrapHeaderComponent],
})
export class BootstrapLayoutModule {}
