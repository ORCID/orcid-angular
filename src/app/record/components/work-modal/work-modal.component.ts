import { Component, OnInit } from '@angular/core'
import { FormArray, FormBuilder, FormGroup } from '@angular/forms'
import { PlatformInfo, PlatformInfoService } from 'src/app/cdk/platform-info'
import { RecordWorksService } from 'src/app/core/record-works/record-works.service'
import {
  CitationTypes,
  DayOption,
  LanguageMap,
  MonthOption,
  WorkCategoryLabels,
  WorkDynamicTitles,
  WorkRelationships,
  WorkTitleTypesLabels,
  WorkType,
  WorkTypesLabels,
  YearOption,
} from 'src/app/types/works.endpoint'

@Component({
  selector: 'app-work-modal',
  templateUrl: './work-modal.component.html',
  styleUrls: ['./work-modal.component.scss'],
})
export class WorkModalComponent implements OnInit {
  loading = true
  workForm: FormGroup
  platform: PlatformInfo

  languageMap = LanguageMap
  workCategories = WorkCategoryLabels
  yearOptions = YearOption
  monthOptions = MonthOption
  dayOptions = DayOption
  citationTypes = CitationTypes
  workTypes: WorkType[] = []
  workRelationships = WorkRelationships

  dynamicTitle = WorkDynamicTitles.journalTitle
  workIdentifiersControls: FormArray

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
      workCategory: ['', []],
      workType: ['', []],
      title: ['', []],
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
          externalIdentifierUrl: ['', []],
          externalRelationship: ['', []],
        }),
      ]),
      languageCode: ['', []],
      countryCode: ['', []],

      visibility: ['', []],
    })
    this.workForm.get('workCategory').valueChanges.subscribe((value) => {
      this.workTypes = WorkTypesLabels[value]
    })
    this.workForm.get('workType').valueChanges.subscribe((value) => {
      if (this.workForm.value['workCategory'] && value) {
        this.dynamicTitle =
          WorkTitleTypesLabels[this.workForm.value['workCategory']][value]
      }
    })

    this.workService.loadWorkTypes().subscribe((value) => {
      this.workTypes = value
    })

    this.workIdentifiersControls = this.workForm.controls
      .workIdentifiers as FormArray
  }

  saveEvent() {}
  closeEvent() {}
}
