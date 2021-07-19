import { Component, OnDestroy, OnInit } from '@angular/core'
import { Subject } from 'rxjs'
import { Work } from '../../../../../types/record-works.endpoint'
import { MatDialogRef } from '@angular/material/dialog'
import { ModalComponent } from '../../../../../cdk/modal/modal/modal.component'
import { RecordWorksService } from '../../../../../core/record-works/record-works.service'
import { PlatformInfoService } from '../../../../../cdk/platform-info'
import { takeUntil } from 'rxjs/operators'
import { FormGroup } from '@angular/forms'

@Component({
  selector: 'app-modal-delete-works',
  templateUrl: './modal-delete-works.component.html',
  styleUrls: [
    './modal-delete-works.component.scss',
    './modal-delete-works.component.scss-theme.scss'
  ]
})
export class ModalDeleteWorksComponent implements OnInit, OnDestroy {
  $destroy: Subject<boolean> = new Subject<boolean>()

  isMobile: boolean
  loadingWorks = false
  putCodes: string[] = []
  works: Work[] = []
  worksChecked: Work[] = []
  selectAll: false

  deleteForm: FormGroup

  constructor(
    public dialogRef: MatDialogRef<ModalComponent>,
    private _platform: PlatformInfoService,
    private _recordWorksService: RecordWorksService,
  ) { }

  ngOnInit(): void {
    this._platform
      .get()
      .pipe(takeUntil(this.$destroy))
      .subscribe((platform) => {
        this.isMobile = platform.columns4 || platform.columns8
      })
    if (this.putCodes.length > 0) {
      this.loadingWorks = true
      this.putCodes.forEach((putCode, index) => {
        this._recordWorksService
          .getWorkInfo(putCode)
          .subscribe((work: Work) => {
            this.loadingWorks = false
            this.works.push(work)
            console.log(index)
            console.log(JSON.stringify(this.works))
          })
      })
    }
    // this.deleteForm = new FormGroup({
    //   ''
    // })
  }

  updateCheck() {
    if (this.selectAll) {
      // this.workGroup.groups.map((workGroup) => {
      //   workGroup.works[0].checked = true
      // })
    } else {
      // this.workGroup.groups.map((workGroup) => {
      //   workGroup.works[0].checked = false
      // })
    }
  }

  saveEvent() {
    this.loadingWorks = true
    this._recordWorksService
      .delete(this.putCodes)
      .subscribe(() => {
        this.loadingWorks = false
        this.closeEvent()
        }
      )
  }

  closeEvent() {
    this.dialogRef.close()
  }

  ngOnDestroy() {
    this.$destroy.next(true)
    this.$destroy.unsubscribe()
  }

}

