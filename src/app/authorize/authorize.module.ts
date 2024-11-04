import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button'
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card'
import { MatDividerModule } from '@angular/material/divider'
import { MatIconModule } from '@angular/material/icon'
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu'
import { MatLegacyProgressBarModule as MatProgressBarModule } from '@angular/material/legacy-progress-bar'
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip'

import { A11yLinkModule } from '../cdk/a11y-link/a11y-link.module'
import { InfoDropDownModule } from '../cdk/info-drop-down/info-drop-down.module'
import { TrustedIndividualsDropdownModule } from '../cdk/trusted-individuals-dropdown/trusted-individuals-dropdown.module'
import { AuthorizeRoutingModule } from './authorize-routing.module'
import { OauthErrorComponent } from './components/oauth-error/oauth-error.component'
import { AuthorizeComponent } from './pages/authorize/authorize.component'
import { FormAuthorizeComponent } from './components/form-authorize/form-authorize.component'
import { ShareEmailsDomainsComponent } from '../cdk/interstitials/share-emails-domains/share-emails-domains.component'
import { InterstitialsModule } from '../cdk/interstitials/interstitials.module'

@NgModule({
  declarations: [
    AuthorizeComponent,
    OauthErrorComponent,
    FormAuthorizeComponent,
  ],
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
    MatProgressBarModule,
    InterstitialsModule,
  ],
})
export class AuthorizeModule {}
