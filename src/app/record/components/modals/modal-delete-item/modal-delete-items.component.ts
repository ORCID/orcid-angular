import {
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core'
import { Subject } from 'rxjs'
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms'
import { MatDialogRef } from '@angular/material/dialog'
import { ModalComponent } from '../../../../cdk/modal/modal/modal.component'
import { PlatformInfoService } from '../../../../cdk/platform-info'
import { RecordWorksService } from '../../../../core/record-works/record-works.service'
import { first, takeUntil } from 'rxjs/operators'
import { RecordAffiliationService } from '../../../../core/record-affiliations/record-affiliations.service'
import { RecordFundingsService } from '../../../../core/record-fundings/record-fundings.service'
import { RecordResearchResourceService } from '../../../../core/record-research-resource/record-research-resource.service'
import { RecordPeerReviewService } from '../../../../core/record-peer-review/record-peer-review.service'
import { SnackbarService } from '../../../../cdk/snackbar/snackbar.service'
import { Work } from '../../../../types/record-works.endpoint'

@Component({
    selector: 'app-modal-delete-items',
    templateUrl: './modal-delete-items.component.html',
    styleUrls: [
        './modal-delete-items.component.scss',
        './modal-delete-items.component.scss-theme.scss',
    ],
    standalone: false
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
  @Input() works: Work[] = []

  isMobile: boolean
  loadingItems = false
  items: any[] = []
  selectedItem: boolean
  selectedItems: string[] = []
  selectAll: false
  reloadFeaturedWorks: boolean = false

  deleteForm: UntypedFormGroup

  constructor(
    public dialogRef: MatDialogRef<ModalComponent>,
    private _changeDetectorRef: ChangeDetectorRef,
    private _platform: PlatformInfoService,
    private _recordAffiliationService: RecordAffiliationService,
    private _recordFundingsService: RecordFundingsService,
    private _recordWorksService: RecordWorksService,
    private _recordResearchResourceService: RecordResearchResourceService,
    private _recordPeerReviewService: RecordPeerReviewService,
    private _snackBar: SnackbarService
  ) {}

  ngOnInit(): void {
    this.deleteForm = new UntypedFormGroup({})
    const group: { [key: string]: UntypedFormGroup } = {}

    this._platform
      .get()
      .pipe(takeUntil(this.$destroy))
      .subscribe((platform) => {
        this.isMobile = platform.columns4 || platform.columns8
      })

    if (this.item && this.works.length === 0) {
      this.items.push(this.item)
      this.items.forEach((i) => {
        group[i?.putCode?.value || i.putCode] = new UntypedFormGroup({
          checked: new UntypedFormControl(false),
        })
      })
      this.deleteForm = new UntypedFormGroup(group)
    }

    if (this.works.length > 0) {
      this.loadingItems = true

      this.works.forEach((w) => {
        this.items.push(w)
        group[w.putCode.value] = new UntypedFormGroup({
          checked: new UntypedFormControl(false),
        })
      })
      this.deleteForm = new UntypedFormGroup(group)
      this.loadingItems = false
    }
  }

  saveEvent() {
    const putCodesDelete = []
    let putCode = ''
    this.items.forEach((item, i) => {
      if (
        this.deleteForm.value[
          this.type === 'research-resources' ? item.putCode : item.putCode.value
        ]?.checked
      ) {
        putCode =
          this.type === 'research-resources' ? item.putCode : item.putCode.value
        if (this.items.length > 1) {
          putCodesDelete.push(putCode)
        }
      }
      if (item.featuredDisplayIndex > 0) {
        this.reloadFeaturedWorks = true
      }
    })
    if (putCode || putCodesDelete.length > 0) {
      this.delete(putCodesDelete.length === 0 ? putCode : putCodesDelete)
    } else {
      this._snackBar.showValidationError(
        $localize`:@@shared.youHaveNotSelected:You haven’t selected any items to delete.`,
        $localize`:@@shared.pleaseReview:Please review and fix the issue`
      )
    }
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
          .delete(putCode, this.reloadFeaturedWorks)
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
    this.selectedItems = []
    this.putCodes.forEach((value) => {
      if (this.selectAll) {
        this.selectedItems.push(value)
      }
      this.deleteForm.patchValue({
        [value]: {
          checked: !!this.selectAll,
        },
      })
    })
    this._changeDetectorRef.detectChanges()
  }

  updateCheck(putCode: string) {
    if (this.selectedItems.includes(putCode)) {
      this.selectedItems = this.selectedItems.filter(
        (value) => value !== putCode
      )
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
