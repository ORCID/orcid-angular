import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatDialog, MatDialogModule } from '@angular/material/dialog'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import {
  OrcidModalComponent,
  ORCID_MODAL_DIALOG_PANEL_CLASS,
} from '@orcid/ui'
import { DocumentationPageComponent } from '../../components/documentation-page/documentation-page.component'

type ModalDocsConfig = {
  title: string
  closeAriaLabel: string
  showClose: boolean
  body: string
}

@Component({
  selector: 'orcid-modal-demo-dialog',
  standalone: true,
  imports: [CommonModule, OrcidModalComponent, MatButtonModule],
  template: `
    <orcid-modal
      [title]="config.title"
      [showClose]="config.showClose"
      [closeAriaLabel]="config.closeAriaLabel"
    >
      <div orcidModalBody>
        <p class="orc-ui-font-body" style="margin-top: 0">
          {{ config.body }}
        </p>
        <p class="orc-ui-font-body-small" style="margin-bottom: 0">
          This is placeholder content for the modal container.
        </p>
      </div>

      <div orcidModalFooter>
        <button mat-button type="button" mat-dialog-close="cancel">Cancel</button>
        <button mat-flat-button type="button" mat-dialog-close="confirm">
          Confirm
        </button>
      </div>
    </orcid-modal>
  `,
})
class ModalDemoDialogComponent {
  config!: ModalDocsConfig
}

@Component({
  selector: 'orcid-modal-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    DocumentationPageComponent,
  ],
  templateUrl: './modal-page.component.html',
  styleUrls: ['./modal-page.component.scss'],
})
export class ModalPageComponent {
  config: ModalDocsConfig = {
    title: 'Import your works',
    closeAriaLabel: 'Close dialog',
    showClose: true,
    body: 'These services can help you update your ORCID record quickly by searching for your research outputs from various databases.',
  }

  lastResult = ''

  constructor(private dialog: MatDialog) {}

  openModal(): void {
    const ref = this.dialog.open(ModalDemoDialogComponent, {
      panelClass: ORCID_MODAL_DIALOG_PANEL_CLASS,
    })

    ref.componentInstance.config = { ...this.config }

    ref.afterClosed().subscribe((result) => {
      this.lastResult = result ? String(result) : ''
    })
  }
}

