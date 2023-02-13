import { Component, Inject, Input, OnInit, ViewChild } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { Observable } from 'rxjs'
import { ModalComponent } from 'src/app/cdk/modal/modal/modal.component'
import { PlatformInfo } from 'src/app/cdk/platform-info'
import { WINDOW } from 'src/app/cdk/window'
import { RecordWorksService } from 'src/app/core/record-works/record-works.service'
import { Work } from 'src/app/types/record-works.endpoint'
import { UserRecord } from 'src/app/types/record.local'
import { WorkFormComponent } from '../work-form/work-form/work-form.component'

@Component({
  selector: 'app-work-modal',
  templateUrl: './work-modal.component.html',
  styleUrls: ['./work-modal.component.scss'],
})
export class WorkModalComponent implements OnInit {
  closeLabel = $localize`:@@shared.closeActivityAriaLabel:Close Works`
  cancelAndClose = $localize`:@@shared.cancelAndCloseActivityAriaLabel:Cancel changes and close Works`
  saveAndClose = $localize`:@@shared.saveAndCloseActivityAriaLabel:Save changes to Works`
  @ViewChild('workFormComponent') workFormComponent: WorkFormComponent
  @Input() options: { createACopy: boolean }
  @Input() userRecord: UserRecord
  loading = true
  platform: PlatformInfo
  work: Work

  showTranslationTitle = false

  constructor(
    private _workService: RecordWorksService,
    private _dialogRef: MatDialogRef<ModalComponent>,
    @Inject(WINDOW) private _window: Window,
    @Inject(MAT_DIALOG_DATA) public data: UserRecord
  ) {}

  ngOnInit(): void {
    let workObs: Observable<Work>
    if (this.work?.putCode) {
      workObs = this._workService.getWorkInfo(this.work.putCode.value)
    } else {
      workObs = this._workService.getWork()
    }

    workObs.subscribe((currentWork) => {
      if (this.options?.createACopy) {
        currentWork.putCode = null
      }
      this.work = currentWork
      this.loading = false
    })
  }

  closeEvent() {
    this._dialogRef.close()
  }

  toWorkDetails() {
    this._window.document.getElementById('workDetails').scrollIntoView()
  }

  toIdentifiers() {
    this._window.document.getElementById('identifiers').scrollIntoView()
  }

  toContributors() {
    this._window.document.getElementById('contributors').scrollIntoView()
  }

  toCitation() {
    this._window.document.getElementById('citation').scrollIntoView()
  }
  toOtherInformation() {
    this._window.document.getElementById('otherInformation').scrollIntoView()
  }
  toVisibility() {
    this._window.document.getElementById('visibility').scrollIntoView()
  }
}
