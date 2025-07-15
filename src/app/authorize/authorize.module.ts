import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'

import { MatCardModule } from '@angular/material/card'
import { MatButtonModule } from '@angular/material/button'
import { MatDividerModule } from '@angular/material/divider'
import { MatIconModule } from '@angular/material/icon'
import { MatMenuModule } from '@angular/material/menu'
import { MatProgressBarModule } from '@angular/material/progress-bar'
import { MatTooltipModule } from '@angular/material/tooltip'

import { A11yLinkModule } from '../cdk/a11y-link/a11y-link.module'
import { InfoDropDownModule } from '../cdk/info-drop-down/info-drop-down.module'
import { TrustedIndividualsDropdownModule } from '../cdk/trusted-individuals-dropdown/trusted-individuals-dropdown.module'
import { AuthorizeRoutingModule } from './authorize-routing.module'
import { OauthErrorComponent } from './components/oauth-error/oauth-error.component'
import { AuthorizeComponent } from './pages/authorize/authorize.component'
import { FormAuthorizeComponent } from './components/form-authorize/form-authorize.component'
import { InterstitialsModule } from '../cdk/interstitials/interstitials.module'
import { PortalModule } from '@angular/cdk/portal'

@NgModule({
  declarations: [
    AuthorizeComponent,
    OauthErrorComponent,
    FormAuthorizeComponent,
  ],
  imports: [
    PortalModule,
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
    MatProgressBarModule,
    InterstitialsModule,
  ],
})
export class AuthorizeModule {}
