import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core'
import { Subject } from 'rxjs'
import { RecordImportWizard } from '../../../../../types/record-peer-review-import.endpoint'
import { MatDialogRef } from '@angular/material/dialog'
import { ModalComponent } from '../../../../../cdk/modal/modal/modal.component'
import { RecordWorksService } from '../../../../../core/record-works/record-works.service'
import { first } from 'rxjs/operators'
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms'
import { EXTERNAL_ID_TYPE_WORK, URL_REGEXP } from '../../../../../constants'
import { Work } from '../../../../../types/record-works.endpoint'
import { WorkFormComponent } from '../../../work-form/work-form/work-form.component'
import { WINDOW } from 'src/app/cdk/window'
import { UserRecord } from '../../../../../types/record.local'

@Component({
  selector: 'app-work-doi-modal',
  templateUrl: './work-external-id-modal.component.html',
  styleUrls: ['./work-external-id-modal.component.scss'],
})
export class WorkExternalIdModalComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  $destroy: Subject<boolean> = new Subject<boolean>()

  @ViewChild('workFormComponent') workFormComponent: WorkFormComponent
  @ViewChild('externalIdRef') externalIdElement: ElementRef

  @Input() userRecord: UserRecord
  @Input() type: EXTERNAL_ID_TYPE_WORK
  EXTERNAL_ID_TYPE_WORK = EXTERNAL_ID_TYPE_WORK

  loading = false
  recordImportWizardsOriginal: RecordImportWizard[]
  recordImportWizards: RecordImportWizard[]
  externalIdentifierForm: UntypedFormGroup
  work: Work
  metadataNotFound = false

  constructor(
    public dialogRef: MatDialogRef<ModalComponent>,
    private _formBuilder: UntypedFormBuilder,
    private _recordWorksService: RecordWorksService,
    @Inject(WINDOW) private _window: Window
  ) {}

  ngOnInit(): void {
    this.externalIdentifierForm = this._formBuilder.group({
      externalId: new UntypedFormControl(''),
    })
    if (this.type === EXTERNAL_ID_TYPE_WORK.doi) {
      this.externalIdentifierForm.controls.externalId.setValidators([
        Validators.pattern(URL_REGEXP),
      ])
    }
  }

  ngAfterViewInit() {
    this.externalIdElement.nativeElement.focus()
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
            this.externalIdentifierForm
              .get('externalId')
              .setErrors({ metadataNotFound: true })
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
  toWorkDetails() {
    this._window.document.getElementById('workDetails').scrollIntoView()
  }

  toIdentifiers() {
    this._window.document.getElementById('identifiers').scrollIntoView()
  }

  toContributors() {
    this._window.document.getElementById('contributors').scrollIntoView()
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
