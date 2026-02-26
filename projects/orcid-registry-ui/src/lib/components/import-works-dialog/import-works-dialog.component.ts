import { Component, Inject } from '@angular/core'
import { NgFor, NgIf } from '@angular/common'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import {
  OrcidModalComponent,
  ORCID_MODAL_DIALOG_PANEL_CLASS,
  SkeletonPlaceholderComponent,
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

/** Number of skeleton cards to show in the certified section while loading. */
/** Base on production data, we have 2 certified links */
const CERTIFIED_SKELETON_COUNT = 2
/** Number of skeleton cards to show in the more services section while loading. */
/** Base on production data, we have 15 more services links */
const MORE_SERVICES_SKELETON_COUNT = 15

@Component({
  selector: 'orcid-registry-import-works-dialog',
  standalone: true,
  imports: [
    NgFor,
    NgIf,
    MatButtonModule,
    MatIconModule,
    OrcidModalComponent,
    SkeletonPlaceholderComponent,
  ],
  templateUrl: './import-works-dialog.component.html',
  styleUrls: ['./import-works-dialog.component.scss'],
})
export class ImportWorksDialogComponent {
  /** Whether the "More Services" section is expanded. Default true. */
  moreServicesExpanded = true

  /** Array used to render N skeleton cards in the certified section. */
  certifiedSkeletonCount = Array(CERTIFIED_SKELETON_COUNT)
  /** Array used to render N skeleton cards in the more services section. */
  moreServicesSkeletonCount = Array(MORE_SERVICES_SKELETON_COUNT)

  constructor(
    private _dialogRef: MatDialogRef<ImportWorksDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ImportWorksDialogData
  ) {}

  toggleMoreServices(): void {
    this.moreServicesExpanded = !this.moreServicesExpanded
  }

  /** Aria-label for the More Services toggle: show/hide label based on expanded state (translatable via data). */
  get moreServicesToggleAriaLabel(): string {
    return this.moreServicesExpanded
      ? (this.data?.hideMoreServicesAriaLabel ?? 'Hide more services')
      : (this.data?.showMoreServicesAriaLabel ?? 'Show more services')
  }

  /** Aria-label for the dialog close button (translatable via data). */
  get closeAriaLabel(): string {
    return this.data?.closeAriaLabel ?? 'Close Import your works'
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

  get certifiedSectionHeading(): string {
    return this.data?.certifiedSectionHeading ?? 'ORCID Certified Services'
  }

  get moreServicesHeading(): string {
    return this.data?.moreServicesHeading ?? 'More Services'
  }

  get connectNowLabel(): string {
    return this.data?.connectNowLabel ?? 'Connect now'
  }

  get connectedLabel(): string {
    return this.data?.connectedLabel ?? 'Connected'
  }

  get loading(): boolean {
    return this.data?.loading === true
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
