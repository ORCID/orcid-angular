import { Component, OnDestroy, OnInit } from '@angular/core'
import { Subject } from 'rxjs'
import { RecordImportWizard } from '../../../../../types/record-peer-review-import.endpoint'
import { MatDialogRef } from '@angular/material/dialog'
import { ModalComponent } from '../../../../../cdk/modal/modal/modal.component'
import { RecordWorksService } from '../../../../../core/record-works/record-works.service'

@Component({
  selector: 'app-work-doi-bibtex-modal',
  templateUrl: './work-bibtex-modal.component.html',
  styleUrls: ['./work-bibtex-modal.component.scss']
})
export class WorkBibtexModalComponent implements OnInit, OnDestroy {
  $destroy: Subject<boolean> = new Subject<boolean>()

  loadingWorks = true
  recordImportWizardsOriginal: RecordImportWizard[]
  recordImportWizards: RecordImportWizard[]
  type = ''

  constructor(
    public dialogRef: MatDialogRef<ModalComponent>,
    private _recordWorksService: RecordWorksService
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
