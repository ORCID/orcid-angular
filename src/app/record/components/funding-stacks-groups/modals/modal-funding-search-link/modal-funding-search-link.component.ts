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
      .subscribe(
        (recordImportWizards) => {
          this.recordImportWizardsOriginal = recordImportWizards
          this.recordImportWizards = this.recordImportWizardsOriginal
          // recordImportWizards.forEach((recordImportWizard) => {
          //   recordImportWizard.actTypes.forEach((actType) => {
          //     if (!this.workTypes.includes(actType)) {
          //       this.workTypes.push(actType)
          //     }
          //   })
          //
          //   recordImportWizard.geoAreas.forEach((geoArea) => {
          //     if (!this.geographicalAreas.includes(geoArea)) {
          //       this.geographicalAreas.push(geoArea)
          //     }
          //   })
          // })
          this.loadingFunding = false
        },
        (error) => {
          // console.log('WorkImportWizardError', error);
        }
      )
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
