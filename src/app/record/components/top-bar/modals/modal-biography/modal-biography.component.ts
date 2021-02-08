import { Component, Inject, OnInit } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { ModalComponent } from '../../../../../cdk/modal/modal/modal.component'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { UserRecord } from '../../../../../types/record.local'
import { RecordNamesService } from '../../../../../core/record-names/record-names.service'
import { RecordBiographyService } from '../../../../../core/record-biography/record-biography.service'
import { OrcidValidators } from '../../../../../validators'
import { ILLEGAL_NAME_CHARACTERS_REGEXP, URL_REGEXP } from '../../../../../constants'
import { BiographyEndPoint } from '../../../../../types/record-biography.endpoint'
import { VisibilityStrings } from '../../../../../types/common.endpoint'

@Component({
  selector: 'app-modal-biography',
  templateUrl: './modal-biography.component.html',
  styleUrls: ['./modal-biography.component.scss-theme.scss', './modal-biography.component.scss']
})
export class ModalBiographyComponent implements OnInit {
  biographyForm: FormGroup
  userRecord: UserRecord
  biography: String = ''
  biographyVisibility: VisibilityStrings = 'PRIVATE'
  loadingBiography = true

  constructor(
    public dialogRef: MatDialogRef<ModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: UserRecord,
    private _recordBiographyService: RecordBiographyService,
  ) {}

  ngOnInit(): void {
    this.userRecord = this.data
    if (this.userRecord.biography) {
      this.biography = this.userRecord.biography.biography.value
      this.biographyVisibility = this.userRecord.biography.visibility.visibility
    }

    this.biographyForm = new FormGroup({
      biography: new FormControl(this.biography, {
        validators: [
          OrcidValidators.notPattern(ILLEGAL_NAME_CHARACTERS_REGEXP),
          OrcidValidators.notPattern(URL_REGEXP),
        ],
      }),
      visibility: new FormControl(this.biographyVisibility, {}),
    })
  }

  onSubmit() {}

  formToBackend(biographyForm: FormGroup): BiographyEndPoint {
    return {
      errors: [],
      biography: biographyForm.get('biography').value,
      visibility: biographyForm.get('visibility').value,
    } as BiographyEndPoint
  }

  saveEvent() {
    this.formToBackend(this.biographyForm)
    this.loadingBiography = true
    this._recordBiographyService
      .postBiography(this.formToBackend(this.biographyForm))
      .subscribe((response) => {
        console.log(response)
        this.closeEvent()
      }, error => {
        console.log(error)
      })
  }

  closeEvent() {
    this.dialogRef.close()
  }
}
