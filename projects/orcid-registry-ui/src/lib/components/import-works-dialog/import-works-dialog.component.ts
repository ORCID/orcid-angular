import { Component, Inject } from '@angular/core'
import { NgFor, NgIf } from '@angular/common'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import {
  OrcidModalComponent,
  ORCID_MODAL_DIALOG_PANEL_CLASS,
} from '@orcid/ui'
import type {
  ImportWorksDialogData,
  ImportWorksCertifiedLink,
  ImportWorksMoreLink,
} from './import-works-dialog.types'

export { ORCID_MODAL_DIALOG_PANEL_CLASS } from '@orcid/ui'
export type {
  ImportWorksDialogData,
  ImportWorksCertifiedLink,
  ImportWorksMoreLink,
} from './import-works-dialog.types'

@Component({
  selector: 'orcid-registry-import-works-dialog',
  standalone: true,
  imports: [
    NgFor,
    NgIf,
    MatButtonModule,
    MatIconModule,
    OrcidModalComponent,
  ],
  templateUrl: './import-works-dialog.component.html',
  styleUrls: ['./import-works-dialog.component.scss'],
})
export class ImportWorksDialogComponent {
  /** Whether the "More Services" section is expanded. Default true. */
  moreServicesExpanded = true

  constructor(
    private _dialogRef: MatDialogRef<ImportWorksDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ImportWorksDialogData
  ) {}

  toggleMoreServices(): void {
    this.moreServicesExpanded = !this.moreServicesExpanded
  }

  get title(): string {
    return this.data?.title ?? 'Import your works'
  }

  get introText(): string | undefined {
    return this.data?.introText
  }

  get supportLink(): { url: string; label: string } | undefined {
    return this.data?.supportLink
  }

  get certifiedLinks(): ImportWorksCertifiedLink[] {
    return this.data?.certifiedLinks ?? []
  }

  get moreServicesLinks(): ImportWorksMoreLink[] {
    return this.data?.moreServicesLinks ?? []
  }

  openInNewTab(url: string): void {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer')
    }
  }
}
