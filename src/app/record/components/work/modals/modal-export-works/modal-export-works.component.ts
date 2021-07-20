import { Component, OnDestroy, OnInit } from '@angular/core'
import { Subject } from 'rxjs'
import { MatDialogRef } from '@angular/material/dialog'
import { ModalComponent } from '../../../../../cdk/modal/modal/modal.component'
import { Work } from '../../../../../types/record-works.endpoint'
import { RecordWorksService } from '../../../../../core/record-works/record-works.service'

@Component({
  selector: 'app-modal-export-works',
  templateUrl: './modal-export-works.component.html',
  styleUrls: ['./modal-export-works.component.scss'],
})
export class ModalExportWorksComponent implements OnInit, OnDestroy {
  $destroy: Subject<boolean> = new Subject<boolean>()

  loadingWorks = false
  putCodes: string[] = []
  works: Work[] = []

  constructor(
    public dialogRef: MatDialogRef<ModalComponent>,
    private _recordWorksService: RecordWorksService
  ) {}

  ngOnInit(): void {
    this.loadingWorks = true
    this.putCodes.forEach((putCode) => {
      this._recordWorksService.getWorkInfo(putCode).subscribe((work: Work) => {
        this.loadingWorks = false
        this.works.push(work)
      })
    })
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
