import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { HeaderComponent } from './header/header.component'
import { FooterComponent } from './footer/footer.component'
import { MatMenuModule, MatButtonModule } from '@angular/material'
import { RouterModule } from '@angular/router'

@NgModule({
  imports: [CommonModule, MatMenuModule, MatButtonModule, RouterModule],
  declarations: [HeaderComponent, FooterComponent],
  exports: [HeaderComponent, FooterComponent],
})
export class LayoutModule {}
