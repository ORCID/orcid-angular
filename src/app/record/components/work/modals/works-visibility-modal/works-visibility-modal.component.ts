import { Component, OnDestroy, OnInit } from '@angular/core'
import { Subject } from 'rxjs'
import { Work } from '../../../../../types/record-works.endpoint'
import { MatDialogRef } from '@angular/material/dialog'
import { ModalComponent } from '../../../../../cdk/modal/modal/modal.component'
import { RecordWorksService } from '../../../../../core/record-works/record-works.service'
import {
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms'
import { PlatformInfoService } from '../../../../../cdk/platform-info'
import { takeUntil } from 'rxjs/operators'
import { VisibilityStrings } from 'src/app/types/common.endpoint'
import { RecordService } from 'src/app/core/record/record.service'

@Component({
  selector: 'app-works-visibility-modal',
  templateUrl: './works-visibility-modal.component.html',
  styleUrls: ['./works-visibility-modal.component.scss'],
})
export class WorksVisibilityModalComponent implements OnInit, OnDestroy {
  $destroy: Subject<boolean> = new Subject<boolean>()

  worksForm: UntypedFormGroup
  defaultVisibility: VisibilityStrings
  isMobile: boolean
  loadingWorks = false
  putCodes: string[] = []
  works: Work[] = []
  ngOrcidDefaultVisibilityLabel = $localize`:@@shared.visibilityDescription:Control who can see this information by setting the visibility. Your default visibility is`
  ariaLabelWork = $localize`:@@shared.works:Works`

  constructor(
    public dialogRef: MatDialogRef<ModalComponent>,
    private _platform: PlatformInfoService,
    private _recordWorksService: RecordWorksService,
    private _record: RecordService
  ) {}

  ngOnInit(): void {
    this._platform
      .get()
      .pipe(takeUntil(this.$destroy))
      .subscribe((platform) => {
        this.isMobile = platform.columns4 || platform.columns8
      })

    this.worksForm = new UntypedFormGroup({
      visibility: new UntypedFormControl(this.defaultVisibility, {
        validators: [Validators.required],
      }),
    })

    //
    this._record.getPreferences().subscribe((userRecord) => {
      this.defaultVisibility = userRecord.default_visibility
      this.worksForm.patchValue({
        visibility: this.defaultVisibility,
      })
    })

    if (this.putCodes.length > 0) {
      this._recordWorksService
        .getWorksInfo(this.putCodes)
        .subscribe((works: Work[]) => {
          this.works = works
          this.loadingWorks = false
        })
    }
  }

  saveEvent() {
    this.loadingWorks = true
    this._recordWorksService
      .visibility(this.putCodes, this.worksForm.get('visibility').value)
      .subscribe(() => {
        this.loadingWorks = false
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
