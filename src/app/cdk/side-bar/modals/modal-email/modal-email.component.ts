import { Component, OnInit } from '@angular/core'
import { MatDialogRef } from '@angular/material/dialog'
import { timeout } from 'rxjs/operators'
import { ModalComponent } from 'src/app/cdk/modal/modal/modal.component'

@Component({
  selector: 'app-modal-email',
  templateUrl: './modal-email.component.html',
  styleUrls: ['./modal-email.component.scss'],
})
export class ModalEmailComponent implements OnInit {
  constructor(public dialogRef: MatDialogRef<ModalComponent>) {}

  ngOnInit(): void {}

  saveEvent() {
    this.closeEvent()
  }
  closeEvent() {
    this.dialogRef.close()
  }
}
