import { Component, OnDestroy, OnInit } from '@angular/core'
import { Subject } from 'rxjs'
import { Work } from '../../../../../types/record-works.endpoint'
import { MatDialogRef } from '@angular/material/dialog'
import { ModalComponent } from '../../../../../cdk/modal/modal/modal.component'
import { RecordWorksService } from '../../../../../core/record-works/record-works.service'
import { PlatformInfoService } from '../../../../../cdk/platform-info'
import { takeUntil } from 'rxjs/operators'

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
      this.putCodes.forEach((putCode) => {
        this._recordWorksService
          .getWorkInfo(putCode)
          .subscribe((work: Work) => {
            this.loadingWorks = false
            this.works.push(work)
          })
      })
    }
  }

  saveEvent() {
    this.loadingWorks = true
    if (this.putCodes.length > 0) {
      this._recordWorksService.combine(this.putCodes).subscribe(() => {
        this.loadingWorks = false
        this.closeEvent()
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
