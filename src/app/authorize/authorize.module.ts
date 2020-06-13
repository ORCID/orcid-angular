import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { AuthorizeRoutingModule } from './authorize-routing.module'
import { AuthorizeComponent } from './pages/authorize/authorize.component'
import { MatCardModule } from '@angular/material/card'
import { MatMenuModule } from '@angular/material/menu'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { MatDividerModule } from '@angular/material/divider'
import { A11yLinkModule } from '../cdk/a11y-link/a11y-link.module'
import { MatTooltipModule } from '@angular/material/tooltip'
import { InfoDropDownComponent } from './components/info-drop-down/info-drop-down.component'

@NgModule({
  declarations: [AuthorizeComponent, InfoDropDownComponent],
  imports: [
    CommonModule,
    AuthorizeRoutingModule,
    MatCardModule,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    A11yLinkModule,
    MatTooltipModule,
  ],
})
export class AuthorizeModule {}
