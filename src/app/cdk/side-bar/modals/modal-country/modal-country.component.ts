import { Component, OnInit } from '@angular/core'
import { MatDialogRef } from '@angular/material/dialog'
import { ModalComponent } from 'src/app/cdk/modal/modal/modal.component'

@Component({
  selector: 'app-modal-country',
  templateUrl: './modal-country.component.html',
  styleUrls: [
    './modal-country.component.scss-theme.scss',
    './modal-country.component.scss',
  ],
})
export class ModalCountryComponent implements OnInit {
  constructor(public dialogRef: MatDialogRef<ModalComponent>) {}

  ngOnInit(): void {}

  saveEvent() {
    this.closeEvent()
  }
  closeEvent() {
    this.dialogRef.close()
  }
  backendJsonToForm(emailEndpointJson: any) {
  }

}
