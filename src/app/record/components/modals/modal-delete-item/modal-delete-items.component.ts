import { Component, Input, OnDestroy, OnInit } from '@angular/core'
import { Subject } from 'rxjs'
import { FormControl, FormGroup } from '@angular/forms'
import { MatDialogRef } from '@angular/material/dialog'
import { ModalComponent } from '../../../../cdk/modal/modal/modal.component'
import { PlatformInfoService } from '../../../../cdk/platform-info'
import { RecordWorksService } from '../../../../core/record-works/record-works.service'
import { first, takeUntil } from 'rxjs/operators'
import { RecordAffiliationService } from '../../../../core/record-affiliations/record-affiliations.service'
import { RecordFundingsService } from '../../../../core/record-fundings/record-fundings.service'
import { RecordResearchResourceService } from '../../../../core/record-research-resource/record-research-resource.service'
import { RecordPeerReviewService } from '../../../../core/record-peer-review/record-peer-review.service'
import { Work } from '../../../../types/record-works.endpoint'

@Component({
  selector: 'app-modal-delete-items',
  templateUrl: './modal-delete-items.component.html',
  styleUrls: [
    './modal-delete-items.component.scss',
    './modal-delete-items.component.scss-theme.scss',
  ],
})
export class ModalDeleteItemsComponent implements OnInit, OnDestroy {
  $destroy: Subject<boolean> = new Subject<boolean>()

  @Input() type:
    | 'employment'
    | 'education'
    | 'qualification'
    | 'invited-position'
    | 'distinction'
    | 'membership'
    | 'service'
    | 'works'
    | 'activities'
    | 'peer-review'
    | 'sub-peer-review'
    | 'funding'
    | 'research-resources' = 'activities'

  @Input() item: any
  @Input() putCodes: string[] = []

  isMobile: boolean
  loadingItems = false
  items: any[] = []
  selectedItem: boolean
  selectedItems: string[] = []
  selectAll: false

  deleteForm: FormGroup

  constructor(
    public dialogRef: MatDialogRef<ModalComponent>,
    private _platform: PlatformInfoService,
    private _recordAffiliationService: RecordAffiliationService,
    private _recordFundingsService: RecordFundingsService,
    private _recordWorksService: RecordWorksService,
    private _recordResearchResourceService: RecordResearchResourceService,
    private _recordPeerReviewService: RecordPeerReviewService
  ) {}

  ngOnInit(): void {
    const group: { [key: string]: FormGroup } = {}

    this._platform
      .get()
      .pipe(takeUntil(this.$destroy))
      .subscribe((platform) => {
        this.isMobile = platform.columns4 || platform.columns8
      })

    if (this.item && this.items.length === 0) {
      this.items.push(this.item)
      this.items.forEach((i) => {
        group[i?.putCode?.value || i.putCode] = new FormGroup({
          checked: new FormControl(false),
        })
      })
      this.deleteForm = new FormGroup(group)
    }

    if (this.putCodes.length > 0) {
      this.loadingItems = true
      this.putCodes.forEach((putCode, index) => {
        this._recordWorksService
          .getWorkInfo(putCode)
          .subscribe((work: Work) => {
            this.items.push(work)
            if (index === this.putCodes.length - 1) {
              this.items.forEach((w) => {
                group[w.putCode.value] = new FormGroup({
                  checked: new FormControl(false),
                })
              })
              this.deleteForm = new FormGroup(group)
              this.loadingItems = false
            }
          })
      })
    }
  }

  saveEvent() {
    const putCodesDelete = []
    let putCode = ''
    this.items.forEach((item, i) => {
      if (
        this.deleteForm.value[
          this.type === 'research-resources' ? item.putCode : item.putCode.value
        ].checked
      ) {
        putCode =
          this.type === 'research-resources' ? item.putCode : item.putCode.value
        if (this.items.length > 1) {
          putCodesDelete.push(putCode)
        }
      }
    })
    this.delete(putCodesDelete.length === 0 ? putCode : putCodesDelete)
  }

  delete(putCode) {
    switch (this.type) {
      case 'employment':
      case 'education':
      case 'qualification':
      case 'invited-position':
      case 'distinction':
      case 'membership':
      case 'service':
        this._recordAffiliationService
          .delete(putCode)
          .pipe(first())
          .subscribe(() => {
            this.closeEvent()
          })
        break
      case 'funding':
        this._recordFundingsService
          .delete(putCode)
          .pipe(first())
          .subscribe(() => {
            this.closeEvent()
          })
        break
      case 'works':
        this._recordWorksService
          .delete(putCode)
          .pipe(first())
          .subscribe(() => {
            this.closeEvent()
          })
        break
      case 'research-resources':
        this._recordResearchResourceService
          .delete(putCode)
          .pipe(first())
          .subscribe(() => {
            this.closeEvent()
          })
        break
      case 'peer-review':
        this._recordPeerReviewService
          .delete(putCode)
          .pipe(first())
          .subscribe(() => {
            this.closeEvent()
          })
        break
    }
  }

  isAffiliation(): boolean {
    return (
      this.type === 'employment' ||
      this.type === 'education' ||
      this.type === 'qualification' ||
      this.type === 'invited-position' ||
      this.type === 'distinction' ||
      this.type === 'membership' ||
      this.type === 'service'
    )
  }

  updateCheckAll() {
    this.putCodes.forEach((value) => {
      if (this.selectedItems.includes(value)) {
        if (!!this.selectAll === false) {
          this.selectedItems = this.selectedItems.filter(
            (putCode) => putCode !== value
          )
        }
      } else {
        this.selectedItems.push(value)
      }
      this.deleteForm.patchValue({
        [value]: {
          checked: !!this.selectAll,
        },
      })
    })
  }

  updateCheck(putCode: string) {
    if (this.selectedItems.includes(putCode)) {
      if (!!this.selectAll === false) {
        this.selectedItems = this.selectedItems.filter(
          (value) => value !== putCode
        )
      }
    } else {
      this.selectedItems.push(putCode)
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
