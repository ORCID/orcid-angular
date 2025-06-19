import { Component, OnDestroy, OnInit } from '@angular/core'
import { RecordImportWizard } from '../../../../../types/record-peer-review-import.endpoint'
import { MatDialogRef } from '@angular/material/dialog'
import { ModalComponent } from '../../../../../cdk/modal/modal/modal.component'
import { takeUntil } from 'rxjs/operators'
import { RecordFundingsService } from '../../../../../core/record-fundings/record-fundings.service'
import { Subject } from 'rxjs'

@Component({
  selector: 'app-modal-funding-search-link',
  templateUrl: './modal-funding-search-link.component.html',
  styleUrls: ['./modal-funding-search-link.component.scss'],
})
export class ModalFundingSearchLinkComponent implements OnInit, OnDestroy {
  $destroy: Subject<boolean> = new Subject<boolean>()

  loadingFunding = true
  recordImportWizardsOriginal: RecordImportWizard[]
  recordImportWizards: RecordImportWizard[]
  total = 0

  constructor(
    public dialogRef: MatDialogRef<ModalComponent>,
    private _recordFundingsService: RecordFundingsService
  ) {}

  ngOnInit(): void {
    this.loadFundingImportWizardList()
  }

  loadFundingImportWizardList(): void {
    this._recordFundingsService
      .loadFundingImportWizardList()
      .pipe(takeUntil(this.$destroy))
      .subscribe((recordImportWizards) => {
        this.recordImportWizardsOriginal = recordImportWizards
        this.recordImportWizards = this.recordImportWizardsOriginal
        this.loadingFunding = false
        this.total = this.recordImportWizardsOriginal.length
      })
  }

  saveEvent() {
    this.loadingFunding = true
  }

  closeEvent() {
    this.dialogRef.close()
  }

  ngOnDestroy() {
    this.$destroy.next(true)
    this.$destroy.unsubscribe()
  }
}
