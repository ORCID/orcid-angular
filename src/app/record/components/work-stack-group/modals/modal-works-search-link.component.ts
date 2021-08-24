import { Component, OnDestroy, OnInit } from '@angular/core'
import { Subject } from 'rxjs'
import { MatDialogRef } from '@angular/material/dialog'
import { ModalComponent } from '../../../../cdk/modal/modal/modal.component'
import { RecordImportWizard } from '../../../../types/record-peer-review-import.endpoint'
import { RecordWorksService } from '../../../../core/record-works/record-works.service'
import { takeUntil } from 'rxjs/operators'

@Component({
  selector: 'app-modal-works-search-link',
  templateUrl: './modal-works-search-link.component.html',
  styleUrls: ['./modal-works-search-link.component.scss'],
})
export class ModalWorksSearchLinkComponent implements OnInit, OnDestroy {
  $destroy: Subject<boolean> = new Subject<boolean>()

  loadingWorks = true
  recordImportWizardsOriginal: RecordImportWizard[]
  recordImportWizards: RecordImportWizard[]
  workTypes = []
  geographicalAreas = []
  workTypeSelected = 'All'
  geographicalAreaSelected = 'All'

  constructor(
    public dialogRef: MatDialogRef<ModalComponent>,
    private _recordWorksService: RecordWorksService
  ) {}

  ngOnInit(): void {
    this.loadWorkImportWizardList()
  }

  loadWorkImportWizardList(): void {
    this._recordWorksService
      .loadWorkImportWizardList()
      .pipe(takeUntil(this.$destroy))
      .subscribe(
        (recordImportWizards) => {
          this.recordImportWizardsOriginal = recordImportWizards
          this.recordImportWizards = this.recordImportWizardsOriginal
          recordImportWizards.forEach((recordImportWizard) => {
            recordImportWizard.actTypes.forEach((actType) => {
              if (!this.workTypes.includes(actType)) {
                this.workTypes.push(actType)
              }
            })

            recordImportWizard.geoAreas.forEach((geoArea) => {
              if (!this.geographicalAreas.includes(geoArea)) {
                this.geographicalAreas.push(geoArea)
              }
            })
          })
          this.loadingWorks = false
        }
      )
  }

  searchAndLink() {
    this.recordImportWizards = []
    this.recordImportWizardsOriginal.forEach((recordImportWizard) => {
      if (
        this.workTypeSelected === 'All' &&
        this.geographicalAreaSelected === 'All'
      ) {
        this.recordImportWizards = this.recordImportWizardsOriginal
      } else if (
        this.workTypeSelected === 'All' &&
        recordImportWizard.geoAreas.includes(this.geographicalAreaSelected)
      ) {
        this.recordImportWizards.push(recordImportWizard)
      } else if (
        this.geographicalAreaSelected === 'All' &&
        recordImportWizard.actTypes.includes(this.workTypeSelected)
      ) {
        this.recordImportWizards.push(recordImportWizard)
      } else if (
        recordImportWizard.actTypes.includes(this.workTypeSelected) &&
        recordImportWizard.geoAreas.includes(this.geographicalAreaSelected)
      ) {
        this.recordImportWizards.push(recordImportWizard)
      }
    })
  }

  saveEvent() {
    this.loadingWorks = true
  }

  closeEvent() {
    this.dialogRef.close()
  }

  ngOnDestroy() {
    this.$destroy.next(true)
    this.$destroy.unsubscribe()
  }
}
