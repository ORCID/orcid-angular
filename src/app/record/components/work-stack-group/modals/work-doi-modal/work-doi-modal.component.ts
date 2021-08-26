import { Component, OnDestroy, OnInit } from '@angular/core'
import { Subject } from 'rxjs'
import { RecordImportWizard } from '../../../../../types/record-peer-review-import.endpoint'
import { MatDialogRef } from '@angular/material/dialog'
import { ModalComponent } from '../../../../../cdk/modal/modal/modal.component'
import { RecordWorksService } from '../../../../../core/record-works/record-works.service'
import { first } from 'rxjs/operators'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { URL_REGEXP } from '../../../../../constants'

@Component({
  selector: 'app-work-doi-modal',
  templateUrl: './work-doi-modal.component.html',
  styleUrls: ['./work-doi-modal.component.scss']
})
export class WorkDoiModalComponent implements OnInit, OnDestroy {
  $destroy: Subject<boolean> = new Subject<boolean>()

  loadingWorks = true
  recordImportWizardsOriginal: RecordImportWizard[]
  recordImportWizards: RecordImportWizard[]
  externalIdentifierForm: FormGroup

  constructor(
    public dialogRef: MatDialogRef<ModalComponent>,
    private _formBuilder: FormBuilder,
  private _recordWorksService: RecordWorksService,
  ) { }

  ngOnInit(): void {
    this.externalIdentifierForm = this._formBuilder.group({
      externalId: new FormControl('', {
        validators: [Validators.pattern(URL_REGEXP)],
      }),
    })
    }

  retrieveWork() {
    if (this.externalIdentifierForm.valid){
      this._recordWorksService
        .loadExternalId(this.externalIdentifierForm.get('externalIdentifier').value)
        .pipe(first())
        .subscribe((data) => {
          console.log(data)
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
