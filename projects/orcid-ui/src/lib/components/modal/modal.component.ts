import { Component, Input, Optional, ViewEncapsulation } from '@angular/core'
import { NgIf } from '@angular/common'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { MatDialogRef } from '@angular/material/dialog'

export const ORCID_MODAL_DIALOG_PANEL_CLASS = 'orcid-modal-dialog-panel'

@Component({
  selector: 'orcid-modal',
  standalone: true,
  imports: [NgIf, MatButtonModule, MatIconModule],
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class OrcidModalComponent {
  /** Optional title string for the modal header. */
  @Input() title = ''

  /** When true, show the close icon button in the header. */
  @Input() showClose = true

  /** Accessible label for the close icon button. */
  @Input() closeAriaLabel = 'Close dialog'

  constructor(@Optional() private dialogRef?: MatDialogRef<unknown>) {}

  close(): void {
    this.dialogRef?.close()
  }
}
