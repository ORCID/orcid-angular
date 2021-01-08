import { Component, EventEmitter, OnInit, Output } from '@angular/core'
import { MatDialogRef } from '@angular/material/dialog'

@Component({
  selector: 'app-modal-header',
  templateUrl: './modal-header.component.html',
  styleUrls: [
    './modal-header.component.scss',
    './modal-header.component.scss-theme.scss',
  ],
})
export class ModalHeaderComponent implements OnInit {
  @Output() close = new EventEmitter<boolean>()

  constructor(private dialogReg: MatDialogRef<any>) {}

  ngOnInit(): void {}

  closeEvent() {
    this.dialogReg.close()
    this.close.next()
  }
}
