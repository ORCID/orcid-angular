import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { MatCardModule } from '@angular/material/card'
import { MatIconModule } from '@angular/material/icon'
import { MatDividerModule } from '@angular/material/divider'
import { InfoDropDownModule } from '../info-drop-down/info-drop-down.module'
import { MatProgressBarModule } from '@angular/material/progress-bar'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatButtonModule } from '@angular/material/button'
import { InfoPanelModule } from '../info-panel/info-panel.module'
import { A11yLinkModule } from '../a11y-link/a11y-link.module'
import { MatLegacyAutocompleteModule as MatAutocompleteModule } from '@angular/material/legacy-autocomplete'
import { MatLegacyFormFieldModule } from '@angular/material/legacy-form-field'
import { MatLegacySelectModule } from '@angular/material/legacy-select'
import { SharedModule } from 'src/app/shared/shared.module'
import { MAT_AUTOCOMPLETE_SCROLL_STRATEGY } from '@angular/material/autocomplete'
import { MAT_SELECT_SCROLL_STRATEGY_PROVIDER } from '@angular/material/select'
import { MatLegacyInputModule } from '@angular/material/legacy-input'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { AffiliationsInterstitialComponent } from './affiliations-interstitial/interstitial-component/affiliations-interstitial.component'
import { AffiliationsInterstitialDialogComponent } from './affiliations-interstitial/interstitial-dialog-extend/affiliations-interstitial-dialog.component'
import { ShareEmailsDomainsDialogComponent } from './share-emails-domains/interstitial-dialog-extend/share-emails-domains-dialog.component'
import { ShareEmailsDomainsComponent } from './share-emails-domains/interstitial-component/share-emails-domains.component'

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
    MatCardModule,
    MatAutocompleteModule,
    MatLegacyFormFieldModule,
    MatLegacySelectModule,
    MatLegacyInputModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatDividerModule,
    InfoDropDownModule,
    MatProgressBarModule,
    ReactiveFormsModule,
    FormsModule,
    MatCheckboxModule,
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
