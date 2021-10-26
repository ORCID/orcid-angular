import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core'
import { Subject } from 'rxjs'
import { MatDialogRef } from '@angular/material/dialog'
import { ModalComponent } from '../../../../../cdk/modal/modal/modal.component'
import { Work, WorksEndpoint } from '../../../../../types/record-works.endpoint'
import { RecordWorksService } from '../../../../../core/record-works/record-works.service'

@Component({
  selector: 'app-modal-export-works',
  templateUrl: './modal-export-works.component.html',
  styleUrls: ['./modal-export-works.component.scss'],
  preserveWhitespaces: true,
})
export class ModalExportWorksComponent implements OnInit, OnDestroy {
  $destroy: Subject<boolean> = new Subject<boolean>()

  loadingWorks = false
  putCodes: string[] = []
  selectedAll: boolean
  totalWorks: number
  works: Work[] = []
  maxNumberOfWorksToDisplay = 50

  constructor(
    private elementRef: ElementRef,
    public dialogRef: MatDialogRef<ModalComponent>,
    private _recordWorksService: RecordWorksService
  ) {}

  ngOnInit(): void {
    this.loadingWorks = true
    if (this.selectedAll) {
      const pageSize =
        this.totalWorks < this.maxNumberOfWorksToDisplay
          ? this.totalWorks
          : this.maxNumberOfWorksToDisplay
      this._recordWorksService
        .getWorks({ pageSize })
        .subscribe((worksEndpoint: WorksEndpoint) => {
          worksEndpoint.groups.forEach((workGroup) => {
            workGroup.works.forEach((work) => {
              this.works.push(work)
            })
          })
          this.loadingWorks = false
        })
    } else {
      this.putCodes.forEach((putCode) => {
        this._recordWorksService
          .getWorkInfo(putCode)
          .subscribe((work: Work) => {
            this.loadingWorks = false
            this.works.push(work)
          })
      })
    }
  }

  saveEvent() {
    this.loadingWorks = true
    if (this.selectedAll) {
      this._recordWorksService.export().subscribe((data) => {
        this.createTxtFile(data)
        this.closeEvent()
      })
    } else {
      this._recordWorksService
        .exportSelected(this.putCodes)
        .subscribe((data) => {
          this.createTxtFile(data)
          this.closeEvent()
        })
    }
  }

  createTxtFile(data) {
    const anchor = document.createElement('a')
    anchor.setAttribute('css', "{display: 'none'}")
    this.elementRef.nativeElement.append(anchor)
    anchor.setAttribute(
      'href',
      'data:text/x-bibtex;charset=utf-8,' + encodeURIComponent(data)
    )
    anchor.setAttribute('target', '_self')
    anchor.setAttribute('download', 'works.bib')
    anchor.click()
    anchor.remove()
    this.loadingWorks = false
  }

  closeEvent() {
    this.dialogRef.close()
  }

  ngOnDestroy() {
    this.$destroy.next(true)
    this.$destroy.unsubscribe()
  }
}
