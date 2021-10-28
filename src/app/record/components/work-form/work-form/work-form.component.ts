import { Component, Inject, Input, OnInit } from '@angular/core'
import {
  AbstractControl,
  AsyncValidatorFn,
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms'
import {
  PlatformInfo,
  PlatformInfoService,
} from '../../../../cdk/platform-info'
import { Work } from '../../../../types/record-works.endpoint'
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
} from '../../../../types/works.endpoint'
import { RecordCountryCodesEndpoint } from '../../../../types'
import { RecordWorksService } from '../../../../core/record-works/record-works.service'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { ModalComponent } from '../../../../cdk/modal/modal/modal.component'
import { RecordCountriesService } from '../../../../core/record-countries/record-countries.service'
import { WINDOW } from '../../../../cdk/window'
import { UserRecord } from '../../../../types/record.local'
import { first, map, startWith } from 'rxjs/operators'
import { dateValidator } from '../../../../shared/validators/date/date.validator'
import { GetFormErrors, URL_REGEXP } from '../../../../constants'
import { ExternalIdentifier } from '../../../../types/common.endpoint'
import { SnackbarService } from 'src/app/cdk/snackbar/snackbar.service'
import { FundedByRelationValidator } from 'src/app/shared/validators/fundedByRelation/FundedByRelation.validator'
import { workCitationValidator } from 'src/app/shared/validators/citation/work-citation.validator'
import { translatedTitleValidator } from 'src/app/shared/validators/translated-title/translated-title.validator'

@Component({
  selector: 'app-work-form',
  templateUrl: './work-form.component.html',
  styleUrls: [
    './work-form.component.scss',
    './work-form.component.scss-theme.scss',
  ],
})
export class WorkFormComponent implements OnInit {
  @Input() work: Work

  loading = true
  workForm: FormGroup
  platform: PlatformInfo

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

  dynamicTitle = WorksTitleName.journalTitle
  workIdTypes: WorkIdType[]
  workIdentifiersFormArray: FormArray = new FormArray([])
  workIdentifiersFormArrayDisplayState: boolean[] = []

  ngOrcidYear = $localize`:@@shared.year:Year`
  ngOrcidMonth = $localize`:@@shared.month:Month`
  ngOrcidDay = $localize`:@@shared.day:Day`
  ngOrcidSelectLanguage = $localize`:@@shared.selectLanguage:Select a language`

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
    private _snackBar: SnackbarService,

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

    this.loadWorkForm(this.work)
    this.observeFormChanges()

    this._workService.loadWorkIdTypes().subscribe((value) => {
      this.workIdTypes = value
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
        if (value && this.workForm.value['workCategory']) {
          this.dynamicTitle =
            WorkTypesTitle[this.workForm.value['workCategory']][value]
        } else {
          this.dynamicTitle = WorksTitleName.journalTitle
        }
      })
  }

  private loadWorkForm(currentWork: Work): void {
    this.workForm = this._fb.group({
      workCategory: [
        currentWork?.workCategory?.value || '',
        [Validators.required],
      ],
      workType: [currentWork?.workType?.value || '', [Validators.required]],
      title: [currentWork?.title?.value || '', [Validators.required]],
      translatedTitleGroup: this._fb.group(
        {
          translatedTitleContent: [
            currentWork?.translatedTitle?.content || '',
            [],
          ],
          translatedTitleLanguage: [
            currentWork?.translatedTitle?.languageCode || '',
            [],
          ],
        },
        { validator: translatedTitleValidator }
      ),
      subtitle: [currentWork?.subtitle?.value || '', []],
      journalTitle: [currentWork?.journalTitle?.value || '', []],
      publicationDate: this._fb.group(
        {
          publicationDay: [Number(currentWork?.publicationDate?.day) || '', []],
          publicationMonth: [
            Number(currentWork?.publicationDate?.month) || '',
            [],
          ],
          publicationYear: [
            Number(currentWork?.publicationDate?.year) || '',
            [],
          ],
        },
        { validator: dateValidator('publication') }
      ),
      url: [currentWork?.url?.value || '', [Validators.pattern(URL_REGEXP)]],
      citationGroup: this._fb.group(
        {
          citationType: [currentWork?.citation?.citationType.value || '', []],
          citation: [currentWork?.citation?.citation.value || '', []],
          shortDescription: [currentWork?.shortDescription?.value || '', []],
        },
        { validator: workCitationValidator }
      ),
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
            if (value.generatedUrl) {
              formGroup.controls.externalIdentifierUrl.setValue(
                value.generatedUrl
              )
            } else {
              formGroup.controls.externalIdentifierUrl.setValue('')
            }

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
          })
        )
    }
  }

  private checkWorkIdentifiersChanges(index: number) {
    const formGroup = this.workIdentifiersFormArray.controls[index] as FormGroup
    formGroup.controls.externalIdentifierType.valueChanges
      .pipe(startWith(formGroup.controls.externalIdentifierType.value))
      .subscribe((externalIdentifierType) => {
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
      })

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
    const workIdentifierForm = this._fb.group({
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
    workIdentifierForm.setValidators(
      FundedByRelationValidator.fundedByInvalidRelationship()
    )
    this.workIdentifiersFormArray.push(workIdentifierForm)

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
    const formErrors = GetFormErrors(this.workForm)

    const allowInvalidForm = this.formHasOnlyAllowError(formErrors)

    if (this.workForm.valid || allowInvalidForm) {
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
          value: this.workForm.get('citationGroup.shortDescription').value,
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
            value: this.workForm.get('citationGroup.citation').value,
          },
          citationType: {
            value: this.workForm.get('citationGroup.citationType').value,
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
          content: this.workForm.get(
            'translatedTitleGroup.translatedTitleContent'
          ).value,
          languageCode: this.workForm.get(
            'translatedTitleGroup.translatedTitleLanguage'
          ).value,
          errors: [],
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

  /**
   * Return true only if the errors found are only of the type unResolved and validFormat
   */
  private formHasOnlyAllowError(formErrors) {
    if (
      formErrors !== null &&
      Object.keys(formErrors).length === 1 &&
      formErrors.workIdentifiers?.length
    ) {
      return (formErrors.workIdentifiers as {
        [key: string]: { [key: string]: boolean }
      }[]).every(
        (x) =>
          x &&
          Object.keys(x).length === 1 &&
          x.externalIdentifierId &&
          Object.keys(x.externalIdentifierId).length === 1 &&
          (x.externalIdentifierId.unResolved ||
            x.externalIdentifierId.validFormat)
      )
    } else {
      return false
    }
  }

  cancelExternalIdEdit(id: number) {
    if (
      this.workIdentifiersFormArray.controls[id] &&
      !this.workIdentifiersFormArray.controls[id].value
        .externalIdentifierType &&
      !this.workIdentifiersFormArray.controls[id].value.externalIdentifierId
    ) {
      this.deleteWorkId(id)
    } else {
      this.workIdentifiersFormArrayDisplayState[id] = false
    }
  }

  closeEvent() {
    this._dialogRef.close()
  }

  returnZero() {
    return 0
  }
}
