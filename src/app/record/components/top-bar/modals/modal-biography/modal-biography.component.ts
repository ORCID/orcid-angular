import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog'
import { ModalComponent } from '../../../../../cdk/modal/modal/modal.component'

@Component({
  selector: 'app-modal-biography',
  templateUrl: './modal-biography.component.html',
  styleUrls: ['./modal-biography.component.scss']
})
export class ModalBiographyComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ModalComponent>) {}

  ngOnInit(): void {
  }

  saveEvent() {
    this.closeEvent()
  }
  closeEvent() {
    this.dialogRef.close()
  }
}
