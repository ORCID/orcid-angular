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
import { AffiliationsInterstitialComponent } from './affiliations-interstitial/affiliations-interstitial.component'
import { AffiliationsInterstitialDialogComponent } from './affiliations-interstitial/affiliations-interstitial-dialog.component'
import { MatLegacyAutocompleteModule as MatAutocompleteModule } from '@angular/material/legacy-autocomplete'
import { MatLegacyFormFieldModule } from '@angular/material/legacy-form-field'
import { MatLegacySelectModule } from '@angular/material/legacy-select'
import { SharedModule } from 'src/app/shared/shared.module'
import { MAT_AUTOCOMPLETE_SCROLL_STRATEGY } from '@angular/material/autocomplete'
import { MAT_SELECT_SCROLL_STRATEGY_PROVIDER } from '@angular/material/select'
import { MatLegacyInputModule } from '@angular/material/legacy-input'
import { MatLegacyProgressSpinnerModule } from '@angular/material/legacy-progress-spinner'

@NgModule({
  declarations: [
    ShareEmailsDomainsComponent,
    ShareEmailsDomainsDialogComponent,
    AffiliationsInterstitialComponent,
    AffiliationsInterstitialDialogComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    MatLegacyCardModule,
    MatAutocompleteModule,
    MatLegacyFormFieldModule,
    MatLegacySelectModule,
    MatLegacyInputModule,
    MatLegacyProgressSpinnerModule,
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
  exports: [
    ShareEmailsDomainsComponent,
    ShareEmailsDomainsDialogComponent,
    AffiliationsInterstitialComponent,
    AffiliationsInterstitialDialogComponent,
  ],
})
export class InterstitialsModule {}
