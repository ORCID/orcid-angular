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
import { TrustedIndividualsDropdownModule } from '../cdk/trusted-individuals-dropdown/trusted-individuals-dropdown.module'
import { InfoDropDownModule } from '../cdk/info-drop-down/info-drop-down.module'

@NgModule({
  declarations: [AuthorizeComponent],
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
    TrustedIndividualsDropdownModule,
    InfoDropDownModule,
  ],
})
export class AuthorizeModule {}
