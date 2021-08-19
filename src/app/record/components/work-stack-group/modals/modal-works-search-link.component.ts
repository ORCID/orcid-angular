import { Component, OnDestroy, OnInit } from '@angular/core'
import { Subject } from 'rxjs'
import { MatDialogRef } from '@angular/material/dialog'
import { ModalComponent } from '../../../../cdk/modal/modal/modal.component'
import { RecordImportWizard } from '../../../../types/record-peer-review-import.endpoint'
import { environment } from '../../../../../environments/environment.local'
import { RecordWorksService } from '../../../../core/record-works/record-works.service'
import { takeUntil } from 'rxjs/operators'

@Component({
  selector: 'app-modal-works-search-link',
  templateUrl: './modal-works-search-link.component.html',
  styleUrls: ['./modal-works-search-link.component.scss']
})
export class ModalWorksSearchLinkComponent implements OnInit, OnDestroy {
  $destroy: Subject<boolean> = new Subject<boolean>()

  loadingWorks = true
  recordImportWizards: RecordImportWizard[]
  workTypes = []
  geographicalAreas = []
  workTypesSelected: string
  geographicalAreaSelected: string

  constructor(
    public dialogRef: MatDialogRef<ModalComponent>,
    private _recordWorksService: RecordWorksService
  ) { }

  ngOnInit(): void {
    this.loadWorkImportWizardList()
  }

  loadWorkImportWizardList(): void {
      this._recordWorksService.loadWorkImportWizardList()
        .pipe(
          takeUntil(this.$destroy)
        )
        .subscribe(
          (recordImportWizards) => {
            // if (data == null || data.length == 0) {
            //   this.noLinkFlag = false;
            // }
            this.recordImportWizards = recordImportWizards;
            // this.bulkEditShow = false;
            // this.showBibtexImportWizard = false;
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
          },
          error => {
            // console.log('WorkImportWizardError', error);
          }
        );
  };

  openImportWizardUrlFilter(client): string {
    return (
      environment.BASE_URL +
      'oauth/authorize' +
      '?client_id=' +
      client.id +
      '&response_type=code&scope=' +
      client.scopes +
      '&redirect_uri=' +
      client.redirectUri
    )
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
