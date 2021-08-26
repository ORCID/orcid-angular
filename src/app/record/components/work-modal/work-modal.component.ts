import { Component, Inject, OnInit } from '@angular/core'
import {
  AbstractControl,
  AsyncValidatorFn,
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { map, startWith } from 'rxjs/operators'
import { ModalComponent } from 'src/app/cdk/modal/modal/modal.component'
import { PlatformInfo, PlatformInfoService } from 'src/app/cdk/platform-info'
import { WINDOW } from 'src/app/cdk/window'
import { URL_REGEXP } from 'src/app/constants'
import { RecordWorksService } from 'src/app/core/record-works/record-works.service'
import { dateValidator } from 'src/app/shared/validators/date/date.validator'
import { Visibility } from 'src/app/types/common.endpoint'
import { Work } from 'src/app/types/record-works.endpoint'
import { UserRecord } from 'src/app/types/record.local'
import {
  CitationTypes,
  DayOption,
  LanguageMap,
  MonthOption,
  WorkCategories,
  WorksTitleName,
  WorkConferenceTypes,
  WorkIdType,
  WorkIntellectualPropertyTypes,
  WorkOtherOutputTypes,
  WorkPublicationTypes,
  WorkRelationships,
  WorkTypesByCategory,
  WorkTypesTitle,
  YearOption,
} from 'src/app/types/works.endpoint'

@Component({
  selector: 'app-work-modal',
  templateUrl: './work-modal.component.html',
  styleUrls: [
    './work-modal.component.scss',
    './work-modal.component.scss-theme.scss',
  ],
})
export class WorkModalComponent implements OnInit {
  loading = true
  workForm: FormGroup
  platform: PlatformInfo
  work: Work

  showTranslationTitle = false

  languageMap = LanguageMap
  workCategories = WorkCategories
  yearOptions = YearOption
  monthOptions = MonthOption
  dayOptions = DayOption
  citationTypes = CitationTypes

  workRelationships: WorkRelationships[] = Object.keys(
    WorkRelationships
  ) as WorkRelationships[]

  dynamicTitle = WorksTitleName.journalTitle
  workIdTypes: WorkIdType[]
  workIdentifiersArray: FormArray

  ngOrcidYear = $localize`:@@shared.year:Year`
  ngOrcidMonth = $localize`:@@shared.month:Month`
  ngOrcidDay = $localize`:@@shared.day:Day`

  workTypes:
    | typeof WorkConferenceTypes
    | typeof WorkPublicationTypes
    | typeof WorkIntellectualPropertyTypes
    | typeof WorkOtherOutputTypes
    | {} = {}

  constructor(
    private _fb: FormBuilder,
    private _platform: PlatformInfoService,
    private _workService: RecordWorksService,
    private _dialogRef: MatDialogRef<ModalComponent>,
    @Inject(WINDOW) private _window: Window,
    @Inject(MAT_DIALOG_DATA) public data: UserRecord
  ) {}

  ngOnInit(): void {
    this._platform.get().subscribe((value) => {
      this.platform = value
    })
    this._workService.getWork().subscribe((emptyWork) => {
      this.loading = false
      this.workForm = this._fb.group({
        workCategory: [
          this.work?.workCategory?.value || '',
          [Validators.required],
        ],
        workType: [this.work?.workType?.value || '', [Validators.required]],
        title: [this.work?.title?.value || '', [Validators.required]],
        translatedTitleContent: [this.work?.translatedTitle?.content || '', []],
        translatedTitleLanguage: [
          this.work?.translatedTitle?.languageCode || '',
          [],
        ],
        subtitle: [this.work?.subtitle?.value || '', []],
        journalTitle: [this.work?.journalTitle?.value || '', []],
        startDateGroup: this._fb.group(
          {
            startDateDay: [this.work?.createdDate?.day || '', []],
            startDateMonth: [this.work?.createdDate?.month || '', []],
            startDateYear: [this.work?.createdDate?.year || '', []],
          },
          { validator: dateValidator('startDate') }
        ),
        url: [this.work?.url?.value || '', [Validators.pattern(URL_REGEXP)]],
        citationType: [this.work?.citation?.citationType || '', []],
        citation: [this.work?.citation?.citation || '', []],
        shortDescription: [this.work?.shortDescription?.value || '', []],
        workIdentifiers: new FormArray([
          this._fb.group({
            externalIdentifierType: ['', []],
            externalIdentifierId: ['', []],
            externalIdentifierUrl: ['', [Validators.pattern(URL_REGEXP)]],
            externalRelationship: [WorkRelationships.self, []],
          }),
        ]),
        languageCode: [this.work?.languageCode?.value || '', []],
        countryCode: [this.work?.countryCode?.value || '', []],

        visibility: [
          this.work?.visibility?.visibility || emptyWork.visibility.visibility,
          [],
        ],
      })
      this.workForm
        .get('workCategory')
        .valueChanges.pipe(startWith(this.workForm.value['workCategory']))
        .subscribe((value) => {
          if (value) {
            this.workTypes = WorkTypesByCategory[value as WorkCategories]
          }
        })

      this.workForm
        .get('workType')
        .valueChanges.pipe(startWith(this.workForm.value['workType']))
        .subscribe((value) => {
          if (value && this.workForm.value['workCategory'] && value) {
            this.dynamicTitle =
              WorkTypesTitle[this.workForm.value['workCategory']][value]
          }
        })
      this.workForm
        .get('citationType')
        .valueChanges.pipe(startWith(this.workForm.value['citationType']))
        .subscribe((value) => {
          if (value !== '') {
            this.workForm.controls.citation.setValidators([Validators.required])
            this.workForm.controls.citation.updateValueAndValidity()
          } else {
            this.workForm.controls.citation.clearValidators()
            this.workForm.controls.citation.updateValueAndValidity()
          }
        })
      this.workIdentifiersArray = this.workForm.controls
        .workIdentifiers as FormArray

      this.checkWorkIdentifiersChanges(0)

      this._workService.loadWorkIdTypes().subscribe((value) => {
        this.workIdTypes = value
      })
    })
  }

  private externalIdentifierTypeAsyncValidator(
    formGroup: FormGroup,
    externalIdentifierType: string
  ): AsyncValidatorFn {
    return (control: AbstractControl) => {
      return this._workService
        .validateWorkIdTypes(externalIdentifierType, control.value)
        .pipe(
          map((value) => {
            if (!value.validFormat) {
              return {
                validFormat: !value.validFormat,
              }
            } else {
            }
          })
        )
    }
  }

  private checkWorkIdentifiersChanges(index: number) {
    const formGroup = this.workIdentifiersArray.controls[index] as FormGroup
    formGroup.controls.externalIdentifierType.valueChanges.subscribe(
      (externalIdentifierType) => {
        if (externalIdentifierType !== '') {
          formGroup.controls.externalIdentifierId.setValidators([
            Validators.required,
          ])
          formGroup.controls.externalIdentifierId.setAsyncValidators(
            this.externalIdentifierTypeAsyncValidator(
              formGroup,
              externalIdentifierType
            )
          )
          formGroup.controls.externalIdentifierId.updateValueAndValidity()
        } else {
          formGroup.controls.externalIdentifierId.clearValidators()
          formGroup.controls.externalIdentifierId.clearAsyncValidators()
          formGroup.controls.externalIdentifierId.updateValueAndValidity()
        }
      }
    )

    formGroup.controls.externalIdentifierId.valueChanges.subscribe((value) => {
      if (value) {
        formGroup.controls.externalIdentifierType.setValidators([
          Validators.required,
        ])
        formGroup.controls.externalIdentifierType.updateValueAndValidity({
          emitEvent: false,
        })
      } else {
        formGroup.controls.externalIdentifierType.clearValidators()
        formGroup.controls.externalIdentifierType.updateValueAndValidity({
          emitEvent: false,
        })
      }
    })
  }

  addOtherWorkId() {
    this.workIdentifiersArray.controls.push(
      this._fb.group({
        externalIdentifierType: ['', []],
        externalIdentifierId: ['', []],
        externalIdentifierUrl: ['', [Validators.pattern(URL_REGEXP)]],
        externalRelationship: [WorkRelationships.self, []],
      })
    )
    this.checkWorkIdentifiersChanges(
      this.workIdentifiersArray.controls.length - 1
    )
  }
  deleteWorkId(id: number) {
    this.workIdentifiersArray.removeAt(id)
  }

  saveEvent() {
    this.workForm.markAllAsTouched()
    if (this.workForm.valid) {
      const work: Work = {
        visibility: {
          visibility: this.workForm.value.visibility,
        },
        publicationDate: {
          month: this.workForm.value.publicationDateMonth,
          day: this.workForm.value.publicationDateDay,
          year: this.workForm.value.publicationDateYear,
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
        workExternalIdentifiers: this.workForm.value.workIdentifiers.map(
          (workExternalId) => {
            return {
              externalIdentifierId: workExternalId.externalIdentifierId,
              externalIdentifierType: workExternalId.externalIdentifierType,
              url: workExternalId.externalIdentifierUrl,
              relationship: workExternalId.externalRelationship,
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
      this._workService.save(work).subscribe((value) => {
        this._dialogRef.close()
      })
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
