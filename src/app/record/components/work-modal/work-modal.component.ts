import { Component, Inject, OnInit } from '@angular/core'
import {
  AbstractControl,
  AsyncValidatorFn,
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms'
import { first, map, startWith } from 'rxjs/operators'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { Observable } from 'rxjs'
import { ModalComponent } from 'src/app/cdk/modal/modal/modal.component'
import { PlatformInfo, PlatformInfoService } from 'src/app/cdk/platform-info'
import { WINDOW } from 'src/app/cdk/window'
import { URL_REGEXP } from 'src/app/constants'
import { RecordCountriesService } from 'src/app/core/record-countries/record-countries.service'
import { RecordWorksService } from 'src/app/core/record-works/record-works.service'
import { dateValidator } from 'src/app/shared/validators/date/date.validator'
import { RecordCountryCodesEndpoint } from 'src/app/types'
import { ExternalIdentifier } from 'src/app/types/common.endpoint'
import { Work } from 'src/app/types/record-works.endpoint'
import { UserRecord } from 'src/app/types/record.local'
import {
  CitationTypes,
  LanguageMap,
  WorkCategories,
  WorkConferenceTypes,
  WorkIdType,
  WorkIntellectualPropertyTypes,
  WorkOtherOutputTypes,
  WorkPublicationTypes,
  WorkRelationships,
  WorksTitleName,
  WorkTypesByCategory,
  WorkTypesTitle,
} from 'src/app/types/works.endpoint'
import { stubFalse } from 'lodash'

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
  yearOptions = Array(110)
    .fill(0)
    .map((i, idx) => idx + new Date().getFullYear() - 109)
    .reverse()
  yearsEndDate = Array(120)
    .fill(0)
    .map((i, idx) => idx + new Date().getFullYear() - 109)
    .reverse()
  monthOptions = Array(12)
    .fill(0)
    .map((i, idx) => idx + 1)
  dayOptions = Array(31)
    .fill(0)
    .map((i, idx) => idx + 1)
  citationTypes = CitationTypes

  workRelationships: WorkRelationships[] = Object.keys(
    WorkRelationships
  ) as WorkRelationships[]

  dynamicTitle = WorksTitleName.journalTitle
  workIdTypes: WorkIdType[]
  workIdentifiersFormArray: FormArray = new FormArray([])
  workIdentifiersFormArrayDisplayState: boolean[] = []

  ngOrcidYear = $localize`:@@shared.year:Year`
  ngOrcidMonth = $localize`:@@shared.month:Month`
  ngOrcidDay = $localize`:@@shared.day:Day`

  workTypes:
    | typeof WorkConferenceTypes
    | typeof WorkPublicationTypes
    | typeof WorkIntellectualPropertyTypes
    | typeof WorkOtherOutputTypes
    | {} = {}
  originalCountryCodes: RecordCountryCodesEndpoint

  constructor(
    private _fb: FormBuilder,
    private _platform: PlatformInfoService,
    private _workService: RecordWorksService,
    private _dialogRef: MatDialogRef<ModalComponent>,
    private _recordCountryService: RecordCountriesService,
    @Inject(WINDOW) private _window: Window,
    @Inject(MAT_DIALOG_DATA) public data: UserRecord
  ) {}

  ngOnInit(): void {
    this._recordCountryService
      .getCountryCodes()
      .pipe(first())
      .subscribe((codes) => {
        this.originalCountryCodes = codes
      })

    this._platform.get().subscribe((value) => {
      this.platform = value
    })
    // Load an empty work or the current work been edited

    let workObs: Observable<Work>
    if (this.work?.putCode) {
      workObs = this._workService.getWorkInfo(this.work.putCode.value)
    } else {
      workObs = this._workService.getWork()
    }

    workObs.subscribe((currentWork) => {
      this.loadWorkForm(currentWork)
      this.observeFormChanges()

      this._workService.loadWorkIdTypes().subscribe((value) => {
        this.workIdTypes = value
      })
    })
  }

  private observeFormChanges() {
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
  }

  private loadWorkForm(currentWork: Work) {
    this.loading = false
    this.workForm = this._fb.group({
      workCategory: [
        currentWork?.workCategory?.value || '',
        [Validators.required],
      ],
      workType: [currentWork?.workType?.value || '', [Validators.required]],
      title: [currentWork?.title?.value || '', [Validators.required]],
      translatedTitleContent: [currentWork?.translatedTitle?.content || '', []],
      translatedTitleLanguage: [
        currentWork?.translatedTitle?.languageCode || '',
        [],
      ],
      subtitle: [currentWork?.subtitle?.value || '', []],
      journalTitle: [currentWork?.journalTitle?.value || '', []],
      publicationDate: this._fb.group(
        {
          publicationDay: [currentWork?.publicationDate?.day || '', []],
          publicationMonth: [currentWork.publicationDate?.month || '', []],
          publicationYear: [currentWork?.publicationDate?.year || '', []],
        },
        { validator: dateValidator('publication') }
      ),
      url: [currentWork?.url?.value || '', [Validators.pattern(URL_REGEXP)]],
      citationType: [currentWork?.citation?.citationType.value || '', []],
      citation: [currentWork?.citation?.citation.value || '', []],
      shortDescription: [currentWork?.shortDescription?.value || '', []],
      workIdentifiers: new FormArray([]),
      languageCode: [currentWork?.languageCode?.value || '', []],
      countryCode: [currentWork?.countryCode?.value || '', []],

      visibility: [
        currentWork?.visibility?.visibility ||
          currentWork.visibility.visibility,
        [],
      ],
    })
    this.workIdentifiersFormArray = this.workForm.controls
      .workIdentifiers as FormArray

    currentWork.workExternalIdentifiers.forEach((workExternalId) => {
      this.addOtherWorkId(workExternalId)
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
            if (!value.resolved && value.attemptedResolution) {
              return {
                unResolved: !value.resolved,
              }
            }
            if (!value.validFormat) {
              return {
                validFormat: !value.validFormat,
              }
            }
            if (value.generatedUrl) {
              formGroup.controls.externalIdentifierUrl.setValue(
                value.generatedUrl
              )
            } else {
              formGroup.controls.externalIdentifierUrl.setValue(null)
            }
          })
        )
    }
  }

  private checkWorkIdentifiersChanges(index: number) {
    const formGroup = this.workIdentifiersFormArray.controls[index] as FormGroup
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

  addOtherWorkId(existingExternalId?: ExternalIdentifier) {
    if (existingExternalId) {
      this.workIdentifiersFormArrayDisplayState.push(false)
    } else {
      this.workIdentifiersFormArrayDisplayState.push(true)
    }
    this.workIdentifiersFormArray.push(
      this._fb.group({
        externalIdentifierType: [
          existingExternalId?.externalIdentifierType?.value || '',
          [],
        ],
        externalIdentifierId: [
          existingExternalId?.externalIdentifierId?.value || '',
          [],
        ],
        externalIdentifierUrl: [
          existingExternalId?.url?.value || '',
          [Validators.pattern(URL_REGEXP)],
        ],
        externalRelationship: [
          existingExternalId?.relationship?.value || WorkRelationships.self,
          [],
        ],
      })
    )

    this.checkWorkIdentifiersChanges(
      this.workIdentifiersFormArray.controls.length - 1
    )
  }
  deleteWorkId(id: number) {
    this.workIdentifiersFormArrayDisplayState.splice(id, 1)
    this.workIdentifiersFormArray.removeAt(id)
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
