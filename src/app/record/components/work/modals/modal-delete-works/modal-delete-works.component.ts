import { Component, OnDestroy, OnInit } from '@angular/core'
import { Subject } from 'rxjs'
import { Work } from '../../../../../types/record-works.endpoint'
import { MatDialogRef } from '@angular/material/dialog'
import { ModalComponent } from '../../../../../cdk/modal/modal/modal.component'
import { RecordWorksService } from '../../../../../core/record-works/record-works.service'
import { PlatformInfoService } from '../../../../../cdk/platform-info'
import { takeUntil } from 'rxjs/operators'
import { FormControl, FormGroup } from '@angular/forms'

@Component({
  selector: 'app-modal-delete-works',
  templateUrl: './modal-delete-works.component.html',
  styleUrls: [
    './modal-delete-works.component.scss',
    './modal-delete-works.component.scss-theme.scss',
  ],
})
export class ModalDeleteWorksComponent implements OnInit, OnDestroy {
  $destroy: Subject<boolean> = new Subject<boolean>()

  isMobile: boolean
  loadingWorks = false
  savingWorks = false
  putCodes: string[] = []
  works: Work[] = []
  selectedWorks: string[] = []
  selectAll: false

  deleteForm: FormGroup

  constructor(
    public dialogRef: MatDialogRef<ModalComponent>,
    private _platform: PlatformInfoService,
    private _recordWorksService: RecordWorksService
  ) {}

  ngOnInit(): void {
    const group: { [key: string]: FormGroup } = {}

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
            this.works.push(work)
            if (index === this.putCodes.length - 1) {
              this.works.forEach((w) => {
                group[w.putCode.value] = new FormGroup({
                  checked: new FormControl(false),
                })
              })
              this.deleteForm = new FormGroup(group)
              this.loadingWorks = false
            }
          })
      })
    }
  }

  updateCheckAll() {
    this.putCodes.forEach((value) => {
      if (this.selectedWorks.includes(value)) {
        if (!!this.selectAll === false) {
          this.selectedWorks = this.selectedWorks.filter(
            (putCode) => putCode !== value
          )
        }
      } else {
        this.selectedWorks.push(value)
      }
      this.deleteForm.patchValue({
        [value]: {
          checked: !!this.selectAll,
        },
      })
    })
  }

  updateCheck(putCode: string) {
    if (this.selectedWorks.includes(putCode)) {
      if (!!this.selectAll === false) {
        this.selectedWorks = this.selectedWorks.filter(
          (value) => value !== putCode
        )
      }
    } else {
      this.selectedWorks.push(putCode)
    }
  }

  saveEvent() {
    const putCodesDelete = []
    this.savingWorks = true
    this.works.forEach((work, i) => {
      if (this.deleteForm.value[work.putCode.value].checked) {
        putCodesDelete.push(work.putCode.value)
      }
    })
    this._recordWorksService.delete(putCodesDelete).subscribe(() => {
      this.savingWorks = false
      this.closeEvent()
    })
  }

  closeEvent() {
    this.dialogRef.close()
  }

  ngOnDestroy() {
    this.$destroy.next(true)
    this.$destroy.unsubscribe()
  }
}
