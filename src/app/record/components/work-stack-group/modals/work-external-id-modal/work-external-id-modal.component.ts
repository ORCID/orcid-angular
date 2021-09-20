import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { Subject } from 'rxjs'
import { RecordImportWizard } from '../../../../../types/record-peer-review-import.endpoint'
import { MatDialogRef } from '@angular/material/dialog'
import { ModalComponent } from '../../../../../cdk/modal/modal/modal.component'
import { RecordWorksService } from '../../../../../core/record-works/record-works.service'
import { first } from 'rxjs/operators'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { EXTERNAL_ID_TYPE_WORK, URL_REGEXP } from '../../../../../constants'
import { Work } from '../../../../../types/record-works.endpoint'
import { WorkFormComponent } from '../../../work-form/work-form/work-form.component'

@Component({
  selector: 'app-work-doi-modal',
  templateUrl: './work-external-id-modal.component.html',
  styleUrls: ['./work-external-id-modal.component.scss'],
})
export class WorkExternalIdModalComponent implements OnInit, OnDestroy {
  $destroy: Subject<boolean> = new Subject<boolean>()

  @ViewChild('workFormComponent') workFormComponent: WorkFormComponent

  @Input() type: EXTERNAL_ID_TYPE_WORK
  EXTERNAL_ID_TYPE_WORK = EXTERNAL_ID_TYPE_WORK

  loading = false
  recordImportWizardsOriginal: RecordImportWizard[]
  recordImportWizards: RecordImportWizard[]
  externalIdentifierForm: FormGroup
  work: Work
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
      this.loading = true
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
            this.work = work
          }
          this.loading = false
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
