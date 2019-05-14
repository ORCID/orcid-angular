import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import {
  MatButtonModule,
  MatMenuModule,
  MatIconModule,
  MatRippleModule,
} from '@angular/material'
import { RouterModule } from '@angular/router'

import { FooterComponent } from './footer/footer.component'
import { HeaderComponent } from './header/header.component'
import { SearchComponent } from './search/search.component'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'

@NgModule({
  imports: [
    CommonModule,
    MatMenuModule,
    MatButtonModule,
    RouterModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    MatRippleModule,
  ],
  declarations: [HeaderComponent, FooterComponent, SearchComponent],
  exports: [HeaderComponent, FooterComponent],
})
export class LayoutModule {}
