import { Component, Inject, Input, OnInit, ViewChild } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { Observable } from 'rxjs'
import { ModalComponent } from 'src/app/cdk/modal/modal/modal.component'
import { PlatformInfo } from 'src/app/cdk/platform-info'
import { WINDOW } from 'src/app/cdk/window'
import { RecordWorksService } from 'src/app/core/record-works/record-works.service'
import { Work } from 'src/app/types/record-works.endpoint'
import { UserRecord } from 'src/app/types/record.local'

@Component({
  selector: 'app-expanded-work-featured-modal',
  templateUrl: './expanded-work-featured-modal.component.html',
  styleUrls: [
    './expanded-work-featured-modal.component.scss',
    './expanded-work-featured-modal.component.scss-theme.scss',
  ],
  standalone: false,
})
export class ExpandedWorkFeaturedModalComponent implements OnInit {
  closeLabel = $localize`:@@shared.closeActivityAriaLabel:Close Works`
  cancelAndClose = $localize`:@@shared.cancelAndCloseActivityAriaLabel:Cancel changes and close Works`
  saveAndClose = $localize`:@@shared.saveAndCloseActivityAriaLabel:Save changes to Works`
  @Input() options: { createACopy: boolean }
  @Input() userRecord: UserRecord
  loading = true
  platform: PlatformInfo
  work: Work
  privateName = 'Name is private'

  showTranslationTitle = false

  constructor(
    private _workService: RecordWorksService,
    private _dialogRef: MatDialogRef<ModalComponent>,
    @Inject(WINDOW) private _window: Window,
    @Inject(MAT_DIALOG_DATA) public data: UserRecord
  ) {}

  ngOnInit(): void {
    if (this.work?.putCode) {
      this._workService
        .getWorkInfo(
          this.work.putCode.value,
          this.userRecord?.userInfo?.EFFECTIVE_USER_ORCID
        )
        .subscribe((currentWork) => {
          this.work = currentWork
          this.loading = false
        })
    }
  }

  closeEvent() {
    this._dialogRef.close()
  }

  toWorkDetails() {
    this._window.document.getElementById('work-detail').scrollIntoView()
  }

  toIdentifiers() {
    this._window.document.getElementById('work-identifiers').scrollIntoView()
  }

  toContributors() {
    this._window.document.getElementById('work-contributors').scrollIntoView()
  }

  toCitation() {
    this._window.document.getElementById('work-citation').scrollIntoView()
  }

  toOtherInformation() {
    this._window.document.getElementById('work-other-info').scrollIntoView()
  }

  toVisibility() {
    this._window.document.getElementById('work-visibility').scrollIntoView()
  }
}
