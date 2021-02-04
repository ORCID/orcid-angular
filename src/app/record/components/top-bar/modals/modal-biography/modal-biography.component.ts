import { Component, Inject, OnInit } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { ModalComponent } from '../../../../../cdk/modal/modal/modal.component'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { UserRecord } from '../../../../../types/record.local'
import { RecordNamesService } from '../../../../../core/record-names/record-names.service'
import { RecordBiographyService } from '../../../../../core/record-biography/record-biography.service'
import { OrcidValidators } from '../../../../../validators'
import { ILLEGAL_NAME_CHARACTERS_REGEXP, URL_REGEXP } from '../../../../../constants'

@Component({
  selector: 'app-modal-biography',
  templateUrl: './modal-biography.component.html',
  styleUrls: ['./modal-biography.component.scss-theme.scss', './modal-biography.component.scss']
})
export class ModalBiographyComponent implements OnInit {
  biographyForm: FormGroup
  userRecord: UserRecord

  constructor(
    public dialogRef: MatDialogRef<ModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: UserRecord,
    public recordBiographyService: RecordBiographyService,
  ) {}

  ngOnInit(): void {
    this.userRecord = this.data
    this.biographyForm = new FormGroup({
      biography: new FormControl(this.userRecord.biography.biography.value, {
        validators: [
          OrcidValidators.notPattern(ILLEGAL_NAME_CHARACTERS_REGEXP),
          OrcidValidators.notPattern(URL_REGEXP),
        ],
      }),
      visibility: new FormControl(this.userRecord.biography.visibility.visibility, {}),
    })
  }

  onSubmit() {}

  saveEvent() {
    this.closeEvent()
  }
  closeEvent() {
    this.dialogRef.close()
  }
}
