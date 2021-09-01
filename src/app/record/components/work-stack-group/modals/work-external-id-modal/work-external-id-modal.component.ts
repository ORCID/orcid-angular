import { Component, Input, OnDestroy, OnInit } from '@angular/core'
import { Subject } from 'rxjs'
import { RecordImportWizard } from '../../../../../types/record-peer-review-import.endpoint'
import { MatDialogRef } from '@angular/material/dialog'
import { ModalComponent } from '../../../../../cdk/modal/modal/modal.component'
import { RecordWorksService } from '../../../../../core/record-works/record-works.service'
import { first } from 'rxjs/operators'
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms'
import { EXTERNAL_ID_TYPE_WORK, URL_REGEXP } from '../../../../../constants'
import { dateValidator } from '../../../../../shared/validators/date/date.validator'
import { WorkRelationships } from '../../../../../types/works.endpoint'
import { Visibility } from '../../../../../types/common.endpoint'

@Component({
  selector: 'app-work-doi-modal',
  templateUrl: './work-external-id-modal.component.html',
  styleUrls: ['./work-external-id-modal.component.scss'],
})
export class WorkExternalIdModalComponent implements OnInit, OnDestroy {
  $destroy: Subject<boolean> = new Subject<boolean>()

  @Input() type: EXTERNAL_ID_TYPE_WORK
  EXTERNAL_ID_TYPE_WORK = EXTERNAL_ID_TYPE_WORK

  loadingWorks = false
  recordImportWizardsOriginal: RecordImportWizard[]
  recordImportWizards: RecordImportWizard[]
  externalIdentifierForm: FormGroup
  workForm: FormGroup
  metadataNotFound = true

  constructor(
    public dialogRef: MatDialogRef<ModalComponent>,
    private _formBuilder: FormBuilder,
    private _recordWorksService: RecordWorksService
  ) {}

  ngOnInit(): void {
    this.externalIdentifierForm = this._formBuilder.group({
      externalId: new FormControl('', {
        validators: [Validators.pattern(URL_REGEXP)],
      }),
    })
  }

  retrieveWork() {
    if (this.externalIdentifierForm.valid) {
      this.loadingWorks = true
      this._recordWorksService
        .loadExternalId(
          this.externalIdentifierForm.get('externalId').value,
          this.type
        )
        .pipe(first())
        .subscribe((work) => {
          if (!work) {
            this.metadataNotFound = true
          } else {
            this.workForm = this._formBuilder.group({
              workCategory: ['', [Validators.required]],
              workType: ['', [Validators.required]],
              title: ['', [Validators.required]],
              translatedTitleContent: ['', []],
              translatedTitleLanguage: ['', []],
              subtitle: ['', []],
              journalTitle: ['', []],
              startDateGroup: this._formBuilder.group(
                {
                  startDateDay: ['', []],
                  startDateMonth: ['', []],
                  startDateYear: ['', []],
                },
                { validator: dateValidator('startDate') }
              ),
              publicationDateYear: ['', []],
              publicationDateMonth: ['', []],
              publicationDateDay: ['', []],
              url: ['', [Validators.pattern(URL_REGEXP)]],
              citationType: ['', []],
              citation: ['', []],
              shortDescription: ['', []],
              workIdentifiers: new FormArray([
                this._formBuilder.group({
                  externalIdentifierType: ['', []],
                  externalIdentifierId: ['', []],
                  externalIdentifierUrl: ['', [Validators.pattern(URL_REGEXP)]],
                  externalRelationship: [WorkRelationships.self, []],
                }),
              ]),
              languageCode: ['', []],
              countryCode: ['', []],

              visibility: [(work.visibility as Visibility).visibility, []],
            })
            // this.workForm.get('workCategory').valueChanges.subscribe((value) => {
            //   this.workTypes = WorkTypesByCategory[value as WorkCategories]
            // })
            // this.workForm.get('workType').valueChanges.subscribe((value) => {
            //   if (this.workForm.value['workCategory'] && value) {
            //     this.dynamicTitle =
            //       WorkTypesTitle[this.workForm.value['workCategory']][value]
            //   }
            // })
            // this.workForm.get('citationType').valueChanges.subscribe((value) => {
            //   if (value !== '') {
            //     this.workForm.controls.citation.setValidators([Validators.required])
            //     this.workForm.controls.citation.updateValueAndValidity()
            //   } else {
            //     this.workForm.controls.citation.clearValidators()
            //     this.workForm.controls.citation.updateValueAndValidity()
            //   }
            // })
            // this.workIdentifiersArray = this.workForm.controls
            //   .workIdentifiers as FormArray
            //
            // this.checkWorkIdentifiersChanges(0)
            //
            // this._workService.loadWorkIdTypes().subscribe((value) => {
            //   this.workIdTypes = value
            // })
          }
        })
    }
  }

  closeEvent() {
    this.dialogRef.close()
  }

  ngOnDestroy() {
    this.$destroy.next(true)
    this.$destroy.unsubscribe()
  }
}
