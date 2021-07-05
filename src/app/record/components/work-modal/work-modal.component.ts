import { Component, OnInit } from '@angular/core'
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms'
import { PlatformInfo, PlatformInfoService } from 'src/app/cdk/platform-info'
import { URL_REGEXP } from 'src/app/constants'
import { RecordWorksService } from 'src/app/core/record-works/record-works.service'
import {
  CitationTypes,
  DayOption,
  LanguageMap,
  MonthOption,
  WorkCategories,
  WorkCategoriesTitle,
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

  showTranslationTitle = false

  languageMap = LanguageMap
  workCategories = WorkCategories
  yearOptions = YearOption
  monthOptions = MonthOption
  dayOptions = DayOption
  citationTypes = CitationTypes
  workTypes:
    | WorkConferenceTypes
    | WorkIntellectualPropertyTypes
    | WorkOtherOutputTypes
    | WorkPublicationTypes
    | {} = {}

  workRelationships = WorkRelationships

  dynamicTitle = WorkCategoriesTitle.journalTitle
  workIdTypes: WorkIdType[]
  workIdentifiersArray: FormArray

  constructor(
    private fb: FormBuilder,
    private _platform: PlatformInfoService,
    private workService: RecordWorksService
  ) {}

  ngOnInit(): void {
    this._platform.get().subscribe((value) => {
      this.platform = value
    })
    this.workForm = this.fb.group({
      workCategory: ['', [Validators.required]],
      workType: ['', [Validators.required]],
      title: ['', [Validators.required]],
      translatedTitleContent: ['', []],
      translatedTitleLanguage: ['', []],
      subtitle: ['', []],
      journalTitle: ['', []],
      publicationDateYear: ['', []],
      publicationDateMonth: ['', []],
      publicationDateDay: ['', []],
      url: ['', []],
      citationType: ['', []],
      citation: ['', []],
      shortDescription: ['', []],
      workIdentifiers: new FormArray([
        this.fb.group({
          externalIdentifierType: ['', []],
          externalIdentifierId: ['', []],
          externalIdentifierUrl: ['', [Validators.pattern(URL_REGEXP)]],
          externalRelationship: ['', []],
        }),
      ]),
      languageCode: ['', []],
      countryCode: ['', []],

      visibility: ['', []],
    })
    this.workForm.get('workCategory').valueChanges.subscribe((value) => {
      this.workTypes = WorkTypesByCategory[value as WorkCategories]
    })
    this.workForm.get('workType').valueChanges.subscribe((value) => {
      if (this.workForm.value['workCategory'] && value) {
        this.dynamicTitle =
          WorkTypesTitle[this.workForm.value['workCategory']][value]
      }
    })
    this.workForm.get('citationType').valueChanges.subscribe((value) => {
      if (value !== '') {
        this.workForm.controls.citation.setValidators([Validators.required])
        this.workForm.controls.citation.updateValueAndValidity()
      } else {
        console.log('REMOVE VALIDATORS')

        this.workForm.controls.citation.clearValidators()
        this.workForm.controls.citation.updateValueAndValidity()
      }
      console.log('validity', this.workForm.controls.citation.valid)
      console.log('value:', `(${this.workForm.controls.citation.value})`)
    })
    this.workIdentifiersArray = this.workForm.controls
      .workIdentifiers as FormArray

    this.workIdentifiersArray.valueChanges.subscribe((value) => {
      console.log(value)
    })

    this.workService.loadWorkIdTypes().subscribe((value) => {
      this.workIdTypes = value
    })
  }

  addOtherWorkId() {
    this.workIdentifiersArray.controls.push(
      this.fb.group({
        externalIdentifierType: ['', []],
        externalIdentifierId: ['', []],
        externalIdentifierUrl: ['', []],
        externalRelationship: ['', []],
      })
    )
    console.log(this.workIdentifiersArray)
  }
  deleteWorkId(id: number) {
    this.workIdentifiersArray.removeAt(id)
  }

  saveEvent() {
    this.workForm.markAllAsTouched()
    console.log(this.workForm.controls.citation)

    console.log('Valid form ', this.workForm.valid)
  }

  closeEvent() {}
}
