import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { DeveloperToolsRoutingModule } from './developer-tools-routing.module'
import { TopBarMyPublicRecordPreviewModule } from '../cdk/top-bar-my-public-record-preview/top-bar-my-public-record-preview.module'
import { SideBarModule } from '../cdk/side-bar/side-bar.module'
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { TermsOfUseComponent } from './components/terms-of-use/terms-of-use.component'
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field'
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input'
import { PanelModule } from '../cdk/panel/panel.module'
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog'
import { PlatformInfoModule } from '../cdk/platform-info'
import { CodePanelComponent } from './components/code-panel/code-panel.component'
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner'
import { ClientSecretComponent } from './components/client-secret/client-secret.component'
import { ClientSecretModalComponent } from './components/client-secret-modal/client-secret-modal.component'
import { ModalModule } from '../cdk/modal/modal.module'
import { A11yLinkModule } from '../cdk/a11y-link/a11y-link.module'
import { TopBarVerificationEmailModule } from '../cdk/top-bar-verification-email/top-bar-verification-email.module'
import { DeveloperToolsComponent } from './pages/developer-tools/developer-tools.component'
import { AlertMessageModule } from '../cdk/alert-message/alert-message.module'

@NgModule({
  declarations: [
    DeveloperToolsComponent,
    TermsOfUseComponent,
    CodePanelComponent,
    ClientSecretComponent,
    ClientSecretModalComponent,
  ],
  imports: [
    CommonModule,
    DeveloperToolsRoutingModule,
    TopBarMyPublicRecordPreviewModule,
    SideBarModule,
    MatCheckboxModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    PanelModule,
    PlatformInfoModule,
    MatProgressSpinnerModule,
    ModalModule,
    A11yLinkModule,
    TopBarVerificationEmailModule,
    AlertMessageModule,
  ],
})
export class DeveloperToolsModule {}
