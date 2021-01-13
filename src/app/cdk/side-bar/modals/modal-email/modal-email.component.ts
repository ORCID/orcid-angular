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
import { map, tap, timeout } from 'rxjs/operators'
import { ModalComponent } from 'src/app/cdk/modal/modal/modal.component'
import { RecordEmailsService } from 'src/app/core/record-emails/record-emails.service'
import { Assertion } from 'src/app/types'
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

  constructor(
    public dialogRef: MatDialogRef<ModalComponent>,
    public _recordEmails: RecordEmailsService,
    private _changeDetectorRef: ChangeDetectorRef
  ) {
    this._recordEmails.getEmails().pipe(
      map((value) => value.emails),
      tap((emails) => {
        emails.forEach((email) => {
          this.addFormInput(email)
        })
      })
    )
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
  addFormInput(email, focusAfter = false) {
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
}
