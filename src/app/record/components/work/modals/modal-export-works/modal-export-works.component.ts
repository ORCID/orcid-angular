import { Component, ElementRef, Inject, OnDestroy, OnInit } from '@angular/core'
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
    private elementRef: ElementRef,
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
    this._recordWorksService.exportSelected(this.putCodes).subscribe((data) => {
      this.loadingWorks = false
      const anchor = document.createElement('a')
      anchor.setAttribute('css', '{display: \'none\'}')
      this.elementRef.nativeElement.append(anchor)
      anchor.setAttribute('href', 'data:text/x-bibtex;charset=utf-8,' + encodeURIComponent(data))
      anchor.setAttribute('target', '_self')
      anchor.setAttribute('download', 'works.bib')
      anchor.click()
      anchor.remove()
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
