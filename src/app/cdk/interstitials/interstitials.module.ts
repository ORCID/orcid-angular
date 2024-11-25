import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ShareEmailsDomainsComponent } from './share-emails-domains/share-emails-domains.component'
import { MatLegacyCardModule } from '@angular/material/legacy-card'
import { MatIconModule } from '@angular/material/icon'
import { MatDividerModule } from '@angular/material/divider'
import { InfoDropDownModule } from '../info-drop-down/info-drop-down.module'
import { MatProgressBarModule } from '@angular/material/progress-bar'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatLegacyCheckboxModule } from '@angular/material/legacy-checkbox'
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button'
import { InfoPanelModule } from '../info-panel/info-panel.module'
import { A11yLinkModule } from '../a11y-link/a11y-link.module'
import { ShareEmailsDomainsDialogComponent } from './share-emails-domains/share-emails-domains-dialog.component'

@NgModule({
  declarations: [
    ShareEmailsDomainsComponent,
    ShareEmailsDomainsDialogComponent,
  ],
  imports: [
    CommonModule,
    MatLegacyCardModule,
    MatIconModule,
    MatDividerModule,
    InfoDropDownModule,
    MatProgressBarModule,
    ReactiveFormsModule,
    FormsModule,
    MatLegacyCheckboxModule,
    MatButtonModule,
    InfoPanelModule,
    A11yLinkModule,
  ],
  exports: [ShareEmailsDomainsComponent, ShareEmailsDomainsDialogComponent],
})
export class InterstitialsModule {}
