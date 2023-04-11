import { Component, Inject, Input, OnInit } from '@angular/core'
import {
  AbstractControl,
  AsyncValidatorFn,
  UntypedFormArray,
  UntypedFormBuilder,
  UntypedFormGroup,
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
  WorkTypesTitle,
} from '../../../../types/works.endpoint'
import { RecordWorksService } from '../../../../core/record-works/record-works.service'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { ModalComponent } from '../../../../cdk/modal/modal/modal.component'
import { RecordCountriesService } from '../../../../core/record-countries/record-countries.service'
import { WINDOW } from '../../../../cdk/window'
import { UserRecord } from '../../../../types/record.local'
import { first, map, startWith } from 'rxjs/operators'
import { dateValidator } from '../../../../shared/validators/date/date.validator'
import {
  GetFormErrors,
  MAX_LENGTH_LESS_THAN_FIVE_THOUSAND,
  MAX_LENGTH_LESS_THAN_ONE_THOUSAND,
  MAX_LENGTH_LESS_THAN_TWO_THOUSAND,
  URL_REGEXP,
} from '../../../../constants'
import {
  Contributor,
  ExternalIdentifier,
  VisibilityStrings,
} from '../../../../types/common.endpoint'
import { SnackbarService } from 'src/app/cdk/snackbar/snackbar.service'
import { WorkIdentifiers } from 'src/app/shared/validators/work-identifiers/work-identifiers.validator'
import { workCitationValidator } from 'src/app/shared/validators/citation/work-citation.validator'
import { translatedTitleValidator } from 'src/app/shared/validators/translated-title/translated-title.validator'
import { merge, Subject } from 'rxjs'
import { RecordService } from 'src/app/core/record/record.service'

@Component({
  selector: 'app-work-form',
  templateUrl: './work-form.component.html',
  styleUrls: [
    './work-form.component.scss',
    './work-form.component.scss-theme.scss',
  ],
})
export class WorkFormComponent implements OnInit {
  ngOrcidYear = $localize`:@@shared.year:Year`
  ngOrcidMonth = $localize`:@@shared.month:Month`
  ngOrcidDay = $localize`:@@shared.day:Day`
  languageLabelAriaLabel = $localize`:@@shared.languageLabelAriaLabel:Select the language used in this form`
  selectCountryLocationLabel = $localize`:@@shared.selectCountryLocationLabel:Select a country or location of publication`

  @Input() work: Work
  @Input() userRecord: UserRecord
  @Input() externalIdentifier: boolean

  $workTypeUpdateEvent = new Subject<WorkIdType>()

  loading = true
  workForm: UntypedFormGroup
  platform: PlatformInfo

  showTranslationTitle = false

  languageMap = LanguageMap
  yearOptions = Array(110)
    .fill(0)
    .map((i, idx) => idx + new Date().getFullYear() - 108)
    .reverse()
  yearsEndDate = Array(120)
    .fill(0)
    .map((i, idx) => idx + new Date().getFullYear() - 108)
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
  workIdentifiersFormArray: UntypedFormArray = new UntypedFormArray([])
  workIdentifiersFormArrayDisplayState: boolean[] = []

  ngOrcidSelectWorkType = $localize`:@@works.selectWorkType:Select a work type`
  ngOrcidSelectLanguage = $localize`:@@shared.selectLanguage:Select a language`
  ngOrcidSelectACitationType = $localize`:@@works.selectACitationType:Select a citation type`
  ngOrcidSelectACountryOrLocation = $localize`:@@shared.selectACountryOrLocation:Select a country or location`
  ngOrcidDefaultVisibilityLabel = $localize`:@@shared.visibilityDescription:Control who can see this information by setting the visibility. Your default visibility is`
  defaultVisibility: VisibilityStrings

  workTypeByCategory = [
    { category: WorkCategories.publication, types: WorkPublicationTypes },
    { category: WorkCategories.conference, types: WorkConferenceTypes },
    {
      category: WorkCategories.intellectual_property,
      types: WorkIntellectualPropertyTypes,
    },
    { category: WorkCategories.other_output, types: WorkOtherOutputTypes },
  ]
  countryCodes: { key: string; value: string }[]

  constructor(
    private _fb: UntypedFormBuilder,
    private _platform: PlatformInfoService,
    private _workService: RecordWorksService,
    private _dialogRef: MatDialogRef<ModalComponent>,
    private _recordCountryService: RecordCountriesService,
    private _snackBar: SnackbarService,
    private _record: RecordService,
    @Inject(WINDOW) private _window: Window,
    @Inject(MAT_DIALOG_DATA) public data: UserRecord
  ) {}

  ngOnInit(): void {
    this._recordCountryService
      .getCountryCodes()
      .pipe(first())
      .subscribe((codes) => {
        this.countryCodes = codes
      })

    this._platform.get().subscribe((value) => {
      this.platform = value
    })

    this.loadWorkForm(this.work)

    this._record.getPreferences().subscribe((userRecord) => {
      this.defaultVisibility = userRecord.default_visibility
    })
    this.observeFormChanges()

    this._workService.loadWorkIdTypes().subscribe((value) => {
      this.workIdTypes = value
    })
  }

  private observeFormChanges() {
    this.workForm
      .get('workType')
      .valueChanges.pipe(startWith(this.workForm.value['workType']))
      .subscribe(
        (
          value:
            | WorkConferenceTypes
            | WorkPublicationTypes
            | WorkIntellectualPropertyTypes
            | WorkOtherOutputTypes
        ) => {
          if (value) {
            this.dynamicTitle = WorkTypesTitle[value]
          } else {
            this.dynamicTitle = WorksTitleName.journalTitle
          }
        }
      )
  }

  private loadWorkForm(currentWork: Work): void {
    this.workForm = this._fb.group({
      workType: [currentWork?.workType?.value || '', [Validators.required]],
      title: [
        currentWork?.title?.value || '',
        [
          Validators.required,
          Validators.maxLength(MAX_LENGTH_LESS_THAN_ONE_THOUSAND),
        ],
      ],
      translatedTitleGroup: this._fb.group(
        {
          translatedTitleContent: [
            currentWork?.translatedTitle?.content || '',
            [Validators.maxLength(MAX_LENGTH_LESS_THAN_ONE_THOUSAND)],
          ],
          translatedTitleLanguage: [
            currentWork?.translatedTitle?.languageCode || '',
            [],
          ],
        },
        { validator: translatedTitleValidator }
      ),
      subtitle: [
        currentWork?.subtitle?.value || '',
        [Validators.maxLength(MAX_LENGTH_LESS_THAN_ONE_THOUSAND)],
      ],
      journalTitle: [
        currentWork?.journalTitle?.value || '',
        [Validators.maxLength(MAX_LENGTH_LESS_THAN_ONE_THOUSAND)],
      ],
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
      url: [
        currentWork?.url?.value || '',
        [
          Validators.pattern(URL_REGEXP),
          Validators.maxLength(MAX_LENGTH_LESS_THAN_TWO_THOUSAND),
        ],
      ],
      citationGroup: this._fb.group(
        {
          citationType: [currentWork?.citation?.citationType?.value || '', []],
          citation: [currentWork?.citation?.citation?.value || '', []],
          shortDescription: [
            currentWork?.shortDescription?.value || '',
            [Validators.maxLength(MAX_LENGTH_LESS_THAN_FIVE_THOUSAND)],
          ],
        },
        { validator: workCitationValidator }
      ),
      workIdentifiers: new UntypedFormArray([]),
      languageCode: [currentWork?.languageCode?.value || '', []],
      countryCode: [currentWork?.countryCode?.value || '', []],

      visibility: [
        currentWork?.visibility?.visibility ||
          currentWork?.visibility?.visibility,
        [],
      ],
    })
    this.workIdentifiersFormArray = this.workForm.controls
      .workIdentifiers as UntypedFormArray

    currentWork?.workExternalIdentifiers.forEach((workExternalId) => {
      this.addOtherWorkId(workExternalId)
    })
  }

  private externalIdentifierTypeAsyncValidator(
    formGroup: UntypedFormGroup,
    externalIdentifierType: string
  ): AsyncValidatorFn {
    return (control: AbstractControl) => {
      return this._workService
        .validateWorkIdTypes(externalIdentifierType, control.value)
        .pipe(
          map((value) => {
            if (
              (formGroup.controls.externalIdentifierUrl?.value?.length > 0 &&
                formGroup.controls.externalIdentifierUrl.value !==
                  formGroup.controls.externalIdentifierUrlWasBackendGenerated
                    .value) ||
              formGroup.controls.externalIdentifierId.value ===
                formGroup.controls.externalIdentifierIdStored.value
            ) {
              // do not overwrite the existing URL
            } else if (
              value.generatedUrl &&
              value.generatedUrl !==
                formGroup.controls.externalIdentifierUrl.value
            ) {
              formGroup.controls.externalIdentifierUrl.setValue(
                decodeURI(value.generatedUrl)
              )
              formGroup.controls.externalIdentifierUrlWasBackendGenerated.setValue(
                decodeURI(value.generatedUrl)
              )
            } else if (
              !value.validFormat ||
              (value.attemptedResolution && !value.resolved)
            ) {
              if (!this.work?.putCode) {
                formGroup.controls.externalIdentifierUrl.setValue('')
              }
            }

            if (value.attemptedResolution && !value.resolved) {
              return {
                unResolved: true,
              }
            }
            if (!value.validFormat) {
              return {
                validFormat: true,
              }
            }
          })
        )
    }
  }

  private checkWorkIdentifiersChanges(
    index: number,
    workIdentifiersArray: UntypedFormArray
  ) {
    const formGroup = this.workIdentifiersFormArray.controls[
      index
    ] as UntypedFormGroup
    merge(
      this.$workTypeUpdateEvent,
      formGroup.controls.externalIdentifierType.valueChanges
    )
      .pipe(
        startWith(formGroup.controls.externalIdentifierType.value),
        // Maps evert value to externalIdentifierTyp since $workTypeUpdateEvent trigger null events
        map((x) => formGroup.controls.externalIdentifierType.value)
      )
      .subscribe((externalIdentifierType) => {
        this.manageWorkIdentifierTypeUpdates(externalIdentifierType, formGroup)
      })

    formGroup.controls.externalIdentifierId.valueChanges.subscribe((id) => {
      this.manageWorkIdentifierIdUpdates(id, formGroup)
    })

    formGroup.controls.externalRelationship.valueChanges.subscribe(() => {
      this.manageWorkIdentyfiersRelationshipUpdates(
        workIdentifiersArray,
        formGroup
      )
    })

    formGroup.controls.externalIdentifierUrl.valueChanges.subscribe((value) => {
      this.manageWorkIdentifierUrlUpdates(formGroup, value)
    })
  }

  private manageWorkIdentifierTypeUpdates(
    externalIdentifierType: any,
    formGroup: UntypedFormGroup
  ) {
    if (externalIdentifierType !== '') {
      formGroup.controls.externalIdentifierId.addValidators(Validators.required)
      formGroup.controls.externalIdentifierId.setAsyncValidators(
        this.externalIdentifierTypeAsyncValidator(
          formGroup,
          externalIdentifierType
        )
      )
      formGroup.controls.externalIdentifierId.updateValueAndValidity()
      const suggestedRelationship = this.getOrcidRecommendedRelationShip(
        externalIdentifierType
      )

      if (suggestedRelationship) {
        formGroup.controls.externalRelationship.setValue(suggestedRelationship)
      }
    } else {
      if (!formGroup.controls.externalIdentifierUrl.value) {
        formGroup.controls.externalIdentifierId.removeValidators(
          Validators.required
        )
        formGroup.controls.externalIdentifierId.clearAsyncValidators()
        formGroup.controls.externalIdentifierId.updateValueAndValidity()
      }
    }
  }

  private manageWorkIdentifierIdUpdates(
    value: any,
    formGroup: UntypedFormGroup
  ) {
    if (value) {
      formGroup.controls.externalIdentifierType.addValidators(
        Validators.required
      )
      formGroup.controls.externalIdentifierType.updateValueAndValidity({
        emitEvent: false,
      })
    } else {
      if (!formGroup.controls.externalIdentifierUrl.value) {
        formGroup.controls.externalIdentifierType.removeValidators(
          Validators.required
        )
        formGroup.controls.externalIdentifierType.updateValueAndValidity({
          emitEvent: false,
        })
      }
    }
  }

  private manageWorkIdentyfiersRelationshipUpdates(
    workIdentifiersArray: UntypedFormArray,
    formGroup: UntypedFormGroup
  ) {
    workIdentifiersArray.controls.forEach((element: UntypedFormGroup) => {
      // Updates the value and validity of all the external identifier relationships on the array
      // Since those depend on each other to validate the `versionOfInvalidRelationship` validator
      if (
        !Object.is(
          element.controls.externalRelationship,
          formGroup.controls.externalRelationship
        )
      ) {
        element.controls.externalRelationship.updateValueAndValidity({
          emitEvent: false,
        })
      }
    })
  }

  private manageWorkIdentifierUrlUpdates(
    formGroup: UntypedFormGroup,
    value: string
  ): void {
    if (value) {
      formGroup.controls.externalIdentifierType.addValidators(
        Validators.required
      )
      formGroup.controls.externalIdentifierType.updateValueAndValidity()
      formGroup.controls.externalIdentifierId.addValidators(Validators.required)
      formGroup.controls.externalIdentifierId.updateValueAndValidity()
    } else {
      if (
        !formGroup.controls.externalIdentifierType.value &&
        !formGroup.controls.externalIdentifierId.value
      ) {
        formGroup.controls.externalIdentifierType.removeValidators(
          Validators.required
        )
        formGroup.controls.externalIdentifierType.updateValueAndValidity()
        formGroup.controls.externalIdentifierId.removeValidators(
          Validators.required
        )
        formGroup.controls.externalIdentifierId.updateValueAndValidity()
      }
    }
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
        existingExternalId?.normalizedUrl?.value ||
          existingExternalId?.url?.value ||
          '',
        [Validators.pattern(URL_REGEXP)],
      ],
      externalIdentifierIdStored: [
        existingExternalId?.externalIdentifierId?.value || '',
      ],
      externalIdentifierUrlWasBackendGenerated: [
        existingExternalId?.normalizedUrl?.value ||
          existingExternalId?.url?.value ||
          '',
      ],
      externalRelationship: [
        existingExternalId?.relationship?.value || WorkRelationships.self,
        [],
      ],
    })
    workIdentifierForm.setValidators([
      WorkIdentifiers.fundedByInvalidRelationship(),
      WorkIdentifiers.versionOfInvalidRelationship(
        this.workIdentifiersFormArray
      ),
    ])
    this.workIdentifiersFormArray.push(workIdentifierForm)

    this.checkWorkIdentifiersChanges(
      this.workIdentifiersFormArray.controls.length - 1,
      this.workIdentifiersFormArray
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
        workType: {
          value: this.workForm.value.workType,
        },
        contributorsGroupedByOrcid: this.getContributors(),
      }
      if (this.work?.putCode) {
        work.putCode = this.work.putCode
      }
      if (this.work?.source) {
        work.source = this.work.source
      }
      this._workService.save(work).subscribe((value) => {
        if (value?.errors?.length > 0) {
          this.loading = false
          this._snackBar.showValidationError(
            value?.errors[0],
            $localize`:@@shared.pleaseReview:Please review and fix the issue`
          )
        } else {
          this.closeEvent()
        }
      })
    } else {
      this._snackBar.showValidationError()
    }
  }

  /**
   * Return true only if the errors found are only of the type unResolved or validFormat
   */
  private formHasOnlyAllowError(formErrors) {
    if (
      formErrors !== null &&
      Object.keys(formErrors).length === 1 &&
      formErrors.workIdentifiers?.length
    ) {
      return (
        formErrors.workIdentifiers as {
          [key: string]: { [key: string]: boolean }
        }[]
      ).every((workIdentifiersErrorList) => {
        return (
          // Either workIdentifiers is null
          // OR it only contains allow error like unResolved or validFormat
          !workIdentifiersErrorList ||
          (workIdentifiersErrorList &&
            Object.keys(workIdentifiersErrorList).length === 1 &&
            workIdentifiersErrorList.externalIdentifierId &&
            Object.keys(workIdentifiersErrorList.externalIdentifierId)
              .length === 1 &&
            workIdentifiersErrorList.externalIdentifierId.unResolved)
        )
      })
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

  getOrcidRecommendedRelationShip(externalIdentifier) {
    let workRelationship = null
    const workType = this.workForm.get('workType').value

    if (externalIdentifier && workType) {
      if (
        externalIdentifier === 'isbn' &&
        workType === WorkPublicationTypes.bookChapter
      ) {
        workRelationship = WorkRelationships['part-of']
      } else if (
        externalIdentifier === 'isbn' &&
        workType === WorkPublicationTypes.book
      ) {
        workRelationship = WorkRelationships.self
      } else if (externalIdentifier === 'issn') {
        workRelationship = WorkRelationships['part-of']
      } else if (
        externalIdentifier === 'isbn' &&
        [
          WorkPublicationTypes.dictionaryEntry,
          WorkConferenceTypes.conferencePaper,
          WorkPublicationTypes.encyclopediaEntry,
        ].indexOf(workType) >= 0
      ) {
        workRelationship = WorkRelationships['part-of']
      }
    }
    if (
      externalIdentifier === 'grant_number' ||
      externalIdentifier === 'proposal-id'
    ) {
      workRelationship = WorkRelationships['funded-by']
    }

    return workRelationship
  }

  private getContributors(): Contributor[] {
    const contributorsFormArray = this.workForm.get(
      'contributors'
    ) as UntypedFormArray
    return contributorsFormArray?.controls.map((c) => {
      const contributor = {
        creditName: {
          content: c.get('creditName')?.value,
        },
        contributorOrcid: {
          uri: c.get(['contributorOrcid', 'uri'])?.value,
          path: c.get(['contributorOrcid', 'path'])?.value,
        },
      } as Contributor
      let rolesFormArray: UntypedFormArray = null
      if (
        c.get(['contributorOrcid', 'path'])?.value ===
        this.userRecord?.userInfo?.EFFECTIVE_USER_ORCID
      ) {
        rolesFormArray = this.workForm.get('roles') as UntypedFormArray
      } else {
        rolesFormArray = c.get('roles') as UntypedFormArray
      }
      const roles = rolesFormArray?.controls
        ?.filter(
          (fg) =>
            fg?.value?.role &&
            this._workService.getContributionRoleByKey(fg?.value?.role) !==
              null &&
            this._workService.getContributionRoleByKey(fg?.value?.role)?.key !==
              'no specified role'
        )
        .map((formGroup) => {
          const role = formGroup?.value?.role
          const value = this._workService.getContributionRoleByKey(role)?.value
          return value ? value : role
        })
      if (roles?.length > 0) {
        contributor.rolesAndSequences = [
          ...roles.map((role) => ({
            contributorRole: role,
          })),
        ]
      }
      return contributor
    })
  }

  closeEvent() {
    this._dialogRef.close()
  }
}
