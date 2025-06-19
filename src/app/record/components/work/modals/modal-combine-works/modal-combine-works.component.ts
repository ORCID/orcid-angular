import { Component, OnDestroy, OnInit } from '@angular/core'
import { Subject } from 'rxjs'
import { Work } from '../../../../../types/record-works.endpoint'
import { MatDialogRef } from '@angular/material/dialog'
import { ModalComponent } from '../../../../../cdk/modal/modal/modal.component'
import { RecordWorksService } from '../../../../../core/record-works/record-works.service'
import { PlatformInfoService } from '../../../../../cdk/platform-info'
import { takeUntil } from 'rxjs/operators'
import { SnackbarService } from '../../../../../cdk/snackbar/snackbar.service'

@Component({
  selector: 'app-modal-combine-works',
  templateUrl: './modal-combine-works.component.html',
  styleUrls: [
    './modal-combine-works.component.scss',
    './modal-combine-works.component.scss-theme.scss',
  ],
})
export class ModalCombineWorksComponent implements OnInit, OnDestroy {
  $destroy: Subject<boolean> = new Subject<boolean>()

  isMobile: boolean
  loadingWorks = false
  putCodes: string[] = []
  works: Work[] = []

  constructor(
    public dialogRef: MatDialogRef<ModalComponent>,
    private _snackBar: SnackbarService,
    private _platform: PlatformInfoService,
    private _recordWorksService: RecordWorksService
  ) {}

  ngOnInit(): void {
    this._platform
      .get()
      .pipe(takeUntil(this.$destroy))
      .subscribe((platform) => {
        this.isMobile = platform.columns4 || platform.columns8
      })
    if (this.putCodes.length > 0) {
      this.loadingWorks = true
      this._recordWorksService
        .getWorksInfo(this.putCodes)
        .subscribe((works: Work[]) => {
          this.works = works.sort((a, b) => {
            const workDateA = `${a.createdDate.year}-${a.createdDate.month}-${a.createdDate.day}`
            const workDateB = `${b.createdDate.year}-${b.createdDate.month}-${b.createdDate.day}`
            return Date.parse(workDateA) - Date.parse(workDateB)
          })
          this.loadingWorks = false
        })
    }
  }

  saveEvent() {
    this.loadingWorks = true
    if (this.putCodes.length > 0) {
      this._recordWorksService
        .combine(this.putCodes)
        .subscribe((workCombineEndpoint) => {
          if (workCombineEndpoint?.errors?.length > 0) {
            this._snackBar.showValidationError(
              workCombineEndpoint.errors[0],
              $localize`:@@ngOrcid.error:Oh no! An error occurred.`
            )
          } else {
            this.closeEvent()
          }
          this.loadingWorks = false
        })
    }
  }

  closeEvent() {
    this.dialogRef.close()
  }

  ngOnDestroy() {
    this.$destroy.next(true)
    this.$destroy.unsubscribe()
  }
}
