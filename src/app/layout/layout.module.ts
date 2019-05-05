import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import {
  MatButtonModule,
  MatMenuModule,
  MatGridListModule,
} from '@angular/material'
import { RouterModule } from '@angular/router'

import { FooterComponent } from './footer/footer.component'
import { HeaderComponent } from './header/header.component'

@NgModule({
  imports: [
    CommonModule,
    MatMenuModule,
    MatButtonModule,
    MatGridListModule,
    RouterModule,
  ],
  declarations: [HeaderComponent, FooterComponent],
  exports: [HeaderComponent, FooterComponent],
})
export class LayoutModule {}
