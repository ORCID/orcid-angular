import { Component, Inject, OnInit, ViewChild } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { Observable } from 'rxjs'
import { ModalComponent } from 'src/app/cdk/modal/modal/modal.component'
import { PlatformInfo, PlatformInfoService } from 'src/app/cdk/platform-info'
import { WINDOW } from 'src/app/cdk/window'
import { RecordWorksService } from 'src/app/core/record-works/record-works.service'
import { Work } from 'src/app/types/record-works.endpoint'
import { UserRecord } from 'src/app/types/record.local'
import { SnackbarService } from 'src/app/cdk/snackbar/snackbar.service'
import { WorkFormComponent } from '../work-form/work-form/work-form.component'

@Component({
  selector: 'app-work-modal',
  templateUrl: './work-modal.component.html',
  styleUrls: ['./work-modal.component.scss'],
})
export class WorkModalComponent implements OnInit {
  @ViewChild('workFormComponent') workFormComponent: WorkFormComponent

  loading = true
  platform: PlatformInfo
  work: Work

  showTranslationTitle = false

  constructor(
    private _snackBar: SnackbarService,
    private _fb: FormBuilder,
    private _platform: PlatformInfoService,
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
      this.work = currentWork
      this.loading = false
    })
  }

  saveEvent() {
    this.workForm.markAllAsTouched()

    if (this.workForm.valid) {
      const work: Work = {
        visibility: {
          visibility: this.workForm.value.visibility,
        },
        publicationDate: {
          month: this.workForm.value.publicationDate.publicationMonth,
          day: this.workForm.value.publicationDate.publicationDay,
          year: this.workForm.value.publicationDate.publicationYear,
        },
        shortDescription: {
          value: this.workForm.value.shortDescription,
        },
        url: {
          value: this.workForm.value.url,
        },
        journalTitle: {
          value: this.workForm.value.journalTitle,
        },
        languageCode: {
          value: this.workForm.value.languageCode
            ? this.workForm.value.languageCode
            : null,
        },
        citation: {
          citation: {
            value: this.workForm.value.citation,
          },
          citationType: {
            value: this.workForm.value.citationType,
          },
        },
        countryCode: {
          value: this.workForm.value.countryCode,
        },
        workExternalIdentifiers: this.workIdentifiersFormArray.value.map(
          (workExternalId) => {
            return {
              externalIdentifierId: {
                value: workExternalId.externalIdentifierId,
              },
              externalIdentifierType: {
                value: workExternalId.externalIdentifierType,
              },
              url: {
                value: workExternalId.externalIdentifierUrl,
              },
              relationship: {
                value: workExternalId.externalRelationship,
              },
            }
          }
        ),
        title: {
          value: this.workForm.value.title,
        },
        subtitle: {
          value: this.workForm.value.subtitle,
        },
        translatedTitle: {
          content: this.workForm.value.translatedTitleContent,
          languageCode: this.workForm.value.translatedTitleLanguage,
        },
        workCategory: {
          value: this.workForm.value.workCategory,
        },
        workType: {
          value: this.workForm.value.workType,
        },
      }
      if (this.work?.putCode) {
        work.putCode = this.work.putCode
      }
      if (this.work?.source) {
        work.source = this.work.source
      }
      this._workService.save(work).subscribe((value) => {
        this._dialogRef.close()
      })
    } else {
      this._snackBar.showValidationError()
    }
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
