import { Component, OnDestroy, OnInit } from '@angular/core'
import { Subject } from 'rxjs'
import { MatDialogRef } from '@angular/material/dialog'
import { take, takeUntil } from 'rxjs/operators'
import { RecordImportWizard } from '../../../../../types/record-peer-review-import.endpoint'
import { ModalComponent } from '../../../../../cdk/modal/modal/modal.component'
import { RecordWorksService } from '../../../../../core/record-works/record-works.service'
import { TogglzService } from '../../../../../core/togglz/togglz.service'
import { TogglzFlag } from '../../../../../types/config.endpoint'
import { sortBy } from 'lodash'

@Component({
  selector: 'app-modal-works-search-link',
  templateUrl: './modal-works-search-link.component.html',
  styleUrls: ['./modal-works-search-link.component.scss'],
  standalone: false,
})
export class ModalWorksSearchLinkComponent implements OnInit, OnDestroy {
  $destroy: Subject<boolean> = new Subject<boolean>()

  loadingWorks = true
  recordImportWizardsOriginal: RecordImportWizard[]
  recordImportWizards: RecordImportWizard[]
  workTypes: string[] = []
  geographicalAreas: string[] = []
  workTypeSelected = 'All'
  geographicalAreaSelected = 'All'
  total = 0
  /** When true, use new search-and-link endpoint and UI (no work type/geo filters, show isConnected). */
  useNewSearchLinkUi = false

  constructor(
    public dialogRef: MatDialogRef<ModalComponent>,
    private _recordWorksService: RecordWorksService,
    private _togglz: TogglzService
  ) {}

  ngOnInit(): void {
    this._togglz
      .getStateOf(TogglzFlag.SEARCH_AND_LINK_WIZARD_WITH_CERTIFIED_AND_FEATURED_LINKS)
      .pipe(take(1), takeUntil(this.$destroy))
      .subscribe((enabled) => {
        this.useNewSearchLinkUi = enabled
        this.loadWorkImportWizardList()
      })
  }

  loadWorkImportWizardList(): void {
    this._recordWorksService
      .loadWorkImportWizardList()
      .pipe(takeUntil(this.$destroy))
      .subscribe((recordImportWizards) => {
        recordImportWizards.forEach((w) => (w.show = w.show ?? false))
        this.recordImportWizardsOriginal = sortBy(recordImportWizards, 'name')
        this.recordImportWizards = [...this.recordImportWizardsOriginal]
        recordImportWizards.forEach((recordImportWizard) => {
          recordImportWizard.actTypes?.forEach((actType) => {
            if (!this.workTypes.includes(actType)) {
              this.workTypes.push(actType)
            }
          })
          recordImportWizard.geoAreas?.forEach((geoArea) => {
            if (!this.geographicalAreas.includes(geoArea)) {
              this.geographicalAreas.push(geoArea)
            }
          })
        })
        this.loadingWorks = false
        this.total = this.recordImportWizardsOriginal.length
      })
  }

  searchAndLink() {
    if (
      this.workTypeSelected === 'All' &&
      this.geographicalAreaSelected === 'All'
    ) {
      this.recordImportWizards = [...this.recordImportWizardsOriginal]
    } else {
      this.recordImportWizards = this.recordImportWizardsOriginal.filter(
        (recordImportWizard) => {
          const matchWorkType =
            this.workTypeSelected === 'All' ||
            (recordImportWizard.actTypes?.length
              ? recordImportWizard.actTypes.includes(this.workTypeSelected)
              : true)
          const matchGeo =
            this.geographicalAreaSelected === 'All' ||
            (recordImportWizard.geoAreas?.length
              ? recordImportWizard.geoAreas.includes(
                  this.geographicalAreaSelected
                )
              : true)
          return matchWorkType && matchGeo
        }
      )
    }
    this.total = this.recordImportWizards.length
  }

  ngOnDestroy() {
    this.$destroy.next(true)
    this.$destroy.unsubscribe()
  }
}
