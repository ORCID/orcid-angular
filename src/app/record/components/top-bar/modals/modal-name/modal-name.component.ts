import { Component, Inject, OnInit } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { ModalComponent } from '../../../../../cdk/modal/modal/modal.component'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { OrcidValidators } from '../../../../../validators'
import { ILLEGAL_NAME_CHARACTERS_REGEXP, URL_REGEXP } from '../../../../../constants'
import { UserRecord } from '../../../../../types/record.local'
import { RecordNamesService } from '../../../../../core/record-names/record-names.service'
import { RecordOtherNamesService } from '../../../../../core/record-other-names/record-other-names.service'

@Component({
  selector: 'app-modal-name',
  templateUrl: './modal-name.component.html',
  styleUrls: ['./modal-name.component.scss-theme.scss', './modal-name.component.scss']
})
export class ModalNameComponent implements OnInit {
  namesForm: FormGroup
  userRecord: UserRecord

  constructor(
    public dialogRef: MatDialogRef<ModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: UserRecord,
    public recordNameService: RecordNamesService,
    public recordOtherNamesService: RecordOtherNamesService,
    ) { }

  ngOnInit(): void {
    this.userRecord = this.data
    console.log(JSON.stringify(this.userRecord));
    this.namesForm = new FormGroup({
      givenNames: new FormControl(this.userRecord.names.givenNames.value, {
        validators: [
          Validators.required,
          OrcidValidators.notPattern(ILLEGAL_NAME_CHARACTERS_REGEXP),
          OrcidValidators.notPattern(URL_REGEXP),
        ],
      }),
      familyNames: new FormControl(this.userRecord.names.familyName.value, {
        validators: [
          OrcidValidators.notPattern(URL_REGEXP),
          OrcidValidators.notPattern(ILLEGAL_NAME_CHARACTERS_REGEXP),
        ],
      }),
      publishedName: new FormControl(this.userRecord.person.displayName),
      visibility: new FormControl(this.userRecord.person.biography.visibility.visibility, {}),
    })
  }

  onSubmit() {}

  addOtherName() {
    // this.recordOtherNamesService.postOtherNames()
  }

  deleteOtherName(putcode: string) {}

  saveEvent() {
    this.closeEvent()
  }
  closeEvent() {
    this.dialogRef.close()
  }
}
