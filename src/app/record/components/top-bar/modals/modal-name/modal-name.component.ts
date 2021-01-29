import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog'
import { ModalComponent } from '../../../../../cdk/modal/modal/modal.component'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { OrcidValidators } from '../../../../../validators'
import { ILLEGAL_NAME_CHARACTERS_REGEXP, URL_REGEXP } from '../../../../../constants'

@Component({
  selector: 'app-modal-name',
  templateUrl: './modal-name.component.html',
  styleUrls: ['./modal-name.component.scss-theme.scss', './modal-name.component.scss']
})
export class ModalNameComponent implements OnInit {
  namesForm: FormGroup

  constructor(public dialogRef: MatDialogRef<ModalComponent>) {}

  ngOnInit(): void {
    this.namesForm = new FormGroup({
      givenNames: new FormControl('', {
        validators: [
          Validators.required,
          OrcidValidators.notPattern(ILLEGAL_NAME_CHARACTERS_REGEXP),
          OrcidValidators.notPattern(URL_REGEXP),
        ],
      }),
      familyNames: new FormControl('', {
        validators: [
          OrcidValidators.notPattern(URL_REGEXP),
          OrcidValidators.notPattern(ILLEGAL_NAME_CHARACTERS_REGEXP),
        ],
      }),
      publishedName: new FormControl(),
    })
  }

  saveEvent() {
    this.closeEvent()
  }
  closeEvent() {
    this.dialogRef.close()
  }
}
