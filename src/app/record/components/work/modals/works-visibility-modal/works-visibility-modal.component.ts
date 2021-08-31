import { Component, OnDestroy, OnInit } from '@angular/core'
import { Subject } from 'rxjs'
import { Work } from '../../../../../types/record-works.endpoint'
import { MatDialogRef } from '@angular/material/dialog'
import { ModalComponent } from '../../../../../cdk/modal/modal/modal.component'
import { RecordWorksService } from '../../../../../core/record-works/record-works.service'
import { FormControl, FormGroup } from '@angular/forms'

@Component({
  selector: 'app-works-visibility-modal',
  templateUrl: './works-visibility-modal.component.html',
  styleUrls: ['./works-visibility-modal.component.scss']
})
export class WorksVisibilityModalComponent implements OnInit, OnDestroy {
  $destroy: Subject<boolean> = new Subject<boolean>()

  worksForm: FormGroup
  loadingWorks = false
  putCodes: string[] = []
  works: Work[] = []

  constructor(
    public dialogRef: MatDialogRef<ModalComponent>,
    private _recordWorksService: RecordWorksService
  ) { }

  ngOnInit(): void {
    this.worksForm = new FormGroup({
      visibility: new FormControl('PRIVATE', {})
    })

    if (this.putCodes.length > 0) {
      this.loadingWorks = true
      this.putCodes.forEach((putCode) => {
        this._recordWorksService.getWorkInfo(putCode).subscribe((work: Work) => {
          this.loadingWorks = false
          this.works.push(work)
        })
      })
    }
  }

  saveEvent() {
    this.loadingWorks = true
    this._recordWorksService.visibility(this.putCodes, this.worksForm.get('visibility').value).subscribe(() => {
      this.loadingWorks = false
      this.closeEvent()
    })
  }

  closeEvent() {
    this.dialogRef.close()
  }

  ngOnDestroy() {
    this.$destroy.next(true)
    this.$destroy.unsubscribe()
  }
}
