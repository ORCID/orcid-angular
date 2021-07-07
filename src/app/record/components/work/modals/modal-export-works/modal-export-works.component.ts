import { Component, OnDestroy, OnInit } from '@angular/core'
import { Subject } from 'rxjs'
import { MatDialogRef } from '@angular/material/dialog'
import { ModalComponent } from '../../../../../cdk/modal/modal/modal.component'

@Component({
  selector: 'app-modal-export-works',
  templateUrl: './modal-export-works.component.html',
  styleUrls: ['./modal-export-works.component.scss']
})
export class ModalExportWorksComponent implements OnInit, OnDestroy {
  $destroy: Subject<boolean> = new Subject<boolean>()

  loadingWorks = true
  works = []

  constructor(
    public dialogRef: MatDialogRef<ModalComponent>,
  ) { }

  ngOnInit(): void {
  }

  saveEvent() {
    this.loadingWorks = true
  }

  closeEvent() {
    this.dialogRef.close()
  }

  ngOnDestroy() {
    this.$destroy.next(true)
    this.$destroy.unsubscribe()
  }

}
