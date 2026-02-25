import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { of } from 'rxjs'
import { delay } from 'rxjs/operators'
import { MatButtonModule } from '@angular/material/button'
import { MatDialog } from '@angular/material/dialog'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatCheckboxModule } from '@angular/material/checkbox'
import {
  ImportWorksDialogComponent,
  ORCID_MODAL_DIALOG_PANEL_CLASS,
  type ImportWorksDialogData,
  type ImportWorksCertifiedLink,
  type ImportWorksMoreLink,
} from '@orcid/registry-ui'
import { DocumentationPageComponent } from '../../components/documentation-page/documentation-page.component'

@Component({
  selector: 'orcid-registry-import-works-dialog-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    DocumentationPageComponent,
  ],
  templateUrl: './import-works-dialog-page.component.html',
  styleUrls: ['./import-works-dialog-page.component.scss'],
})
export class ImportWorksDialogPageComponent {
  title = 'Import your works'
  introText =
    'These services can help you update your ORCID record quickly by searching for your research outputs from various databases. Connect to a service to grant permission and add selected research outputs to your ORCID record.'
  supportLinkUrl = 'https://support.orcid.org/hc/en-us/articles/360006973653'
  supportLinkLabel =
    'Find out more about importing works into your ORCID record'

  certifiedLinks: ImportWorksCertifiedLink[] = [
    {
      name: 'The Lens',
      description:
        'Create or connect your Lens Profile to add patents and other scholarly works and automatically update your ORCID record over time.',
      url: 'https://www.lens.org/',
      connected: false,
      imageUrl: 'https://placehold.co/48x48/e8f4f8/085c77?text=Lens',
    },
    {
      name: 'Web of Science',
      description:
        'Connect your Web of Science profile to import publications and keep your ORCID record in sync.',
      url: 'https://www.webofscience.com/',
      connected: true,
      imageUrl: 'https://placehold.co/48x48/e8f4f8/085c77?text=WoS',
    },
  ]

  moreServicesLinks: ImportWorksMoreLink[] = [
    {
      name: 'Scopus',
      description:
        'Import your Scopus publications and citation metrics into your ORCID record.',
      url: 'https://www.scopus.com/',
    },
    {
      name: 'Europe PMC',
      description:
        'Link your Europe PMC publications to your ORCID record.',
      url: 'https://europepmc.org/',
    },
  ]

  constructor(private _dialog: MatDialog) {}

  openDialog(): void {
    const data: ImportWorksDialogData = {
      title: this.title,
      introText: this.introText,
      supportLink:
        this.supportLinkUrl && this.supportLinkLabel
          ? { url: this.supportLinkUrl, label: this.supportLinkLabel }
          : undefined,
      certifiedLinks: [...this.certifiedLinks],
      moreServicesLinks: [...this.moreServicesLinks],
    }
    this._dialog.open(ImportWorksDialogComponent, {
      panelClass: ORCID_MODAL_DIALOG_PANEL_CLASS,
      data,
      width: '850px',
      maxHeight: '90vh',
    })
  }

  /** Opens the dialog with loading (shimmer) state, then fills in data after a short delay to demo the flow. */
  openDialogWithLoading(): void {
    const dialogRef = this._dialog.open(ImportWorksDialogComponent, {
      panelClass: ORCID_MODAL_DIALOG_PANEL_CLASS,
      data: {
        loading: true,
        title: this.title,
        certifiedLinks: [],
        moreServicesLinks: [],
      } as ImportWorksDialogData,
      width: '850px',
      maxHeight: '90vh',
    })
    const data: ImportWorksDialogData = {
      loading: false,
      title: this.title,
      introText: this.introText,
      supportLink:
        this.supportLinkUrl && this.supportLinkLabel
          ? { url: this.supportLinkUrl, label: this.supportLinkLabel }
          : undefined,
      certifiedLinks: [...this.certifiedLinks],
      moreServicesLinks: [...this.moreServicesLinks],
    }
    of(data)
      .pipe(delay(5000))
      .subscribe((d) => {
        dialogRef.componentInstance.data = d
      })
  }
}
