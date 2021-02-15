import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core'
import { FormControl, FormGroup } from '@angular/forms'
import { MatDialogRef } from '@angular/material/dialog'
import { first, tap } from 'rxjs/operators'
import { ModalComponent } from 'src/app/cdk/modal/modal/modal.component'
import { RecordEmailsService } from 'src/app/core/record-emails/record-emails.service'
import { Assertion, EmailsEndpoint } from 'src/app/types'
import { OrcidValidators } from 'src/app/validators'

@Component({
  selector: 'app-modal-email',
  templateUrl: './modal-email.component.html',
  styleUrls: [
    './modal-email.component.scss-theme.scss',
    './modal-email.component.scss',
  ],
})
export class ModalEmailComponent implements OnInit {
  emailsForm: FormGroup = new FormGroup({})
  emails: Assertion[]
  @ViewChildren('emailInput') inputs: QueryList<ElementRef>
  backendJson: Object

  constructor(
    public dialogRef: MatDialogRef<ModalComponent>,
    public _recordEmails: RecordEmailsService,
    private _changeDetectorRef: ChangeDetectorRef
  ) {
    this._recordEmails
      .getEmails()
      .pipe(
        tap((value) => {
          this.backendJson = value
          this.backendJsonToForm(value)
          this.emails = value.emails
        }),
        first()
      )
      .subscribe()
  }

  tempPrivacyState = 'PUBLIC'
  ngOnInit(): void {}

  saveEvent() {
    this.closeEvent()
  }
  closeEvent() {
    this.dialogRef.close()
  }

  deleteEmail(email) {
    console.log(email)
  }
  addFormInput(email, focusAfter = true) {
    const controlName = email || 'new'
    this.emailsForm.addControl(
      controlName,
      new FormControl(controlName, {
        validators: [OrcidValidators.email],
      })
    )
    this._changeDetectorRef.detectChanges()
    if (focusAfter) {
      const input = this.inputs.last.nativeElement as HTMLInputElement
      input.focus()
    }
  }

  backendJsonToForm(emailEndpointJson: EmailsEndpoint) {
    const emails = emailEndpointJson.emails
    const group: { [key: string]: FormGroup } = {}

    emails.forEach((email) => {
      group[email.value] = new FormGroup({
        email: new FormControl(email.value, {
          validators: [OrcidValidators.email],
        }),
        visibility: new FormControl(email.visibility, {}),
      })
      group[email.value].valueChanges.subscribe((value) => {
        console.log(value)
      })
    })
    this.emailsForm = new FormGroup(group)
  }

  formToBackendJson(fromGroup: FormGroup) {}
}
