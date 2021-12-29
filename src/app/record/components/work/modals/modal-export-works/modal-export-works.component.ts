import { Component, ElementRef, Inject, OnDestroy, OnInit } from '@angular/core'
import { Subject } from 'rxjs'
import { MatDialogRef } from '@angular/material/dialog'
import { ModalComponent } from '../../../../../cdk/modal/modal/modal.component'
import { Work, WorksEndpoint } from '../../../../../types/record-works.endpoint'
import { RecordWorksService } from '../../../../../core/record-works/record-works.service'
import { takeUntil } from 'rxjs/operators'
import { PlatformInfoService } from '../../../../../cdk/platform-info'
import { WINDOW } from 'src/app/cdk/window'

@Component({
  selector: 'app-modal-export-works',
  templateUrl: './modal-export-works.component.html',
  styleUrls: ['./modal-export-works.component.scss'],
  preserveWhitespaces: true,
})
export class ModalExportWorksComponent implements OnInit, OnDestroy {
  $destroy: Subject<boolean> = new Subject<boolean>()

  isMobile: boolean
  loadingWorks = false
  putCodes: string[] = []
  selectedAll: boolean
  totalWorks: number
  works: Work[] = []
  maxNumberOfWorksToDisplay = 100

  constructor(
    private elementRef: ElementRef,
    public dialogRef: MatDialogRef<ModalComponent>,
    private _platform: PlatformInfoService,
    private _recordWorksService: RecordWorksService,
    @Inject(WINDOW) private window: Window
  ) {}

  ngOnInit(): void {
    this._platform
      .get()
      .pipe(takeUntil(this.$destroy))
      .subscribe((platform) => {
        this.isMobile = platform.columns4 || platform.columns8
      })

    this.loadingWorks = true
    if (
      this.selectedAll ||
      this.putCodes?.length > this.maxNumberOfWorksToDisplay
    ) {
      const pageSize =
        this.totalWorks < this.maxNumberOfWorksToDisplay
          ? this.totalWorks
          : this.maxNumberOfWorksToDisplay
      this._recordWorksService
        .getWorks({ pageSize })
        .subscribe((worksEndpoint: WorksEndpoint) => {
          worksEndpoint.groups.forEach((workGroup) => {
            workGroup.works.forEach((work) => {
              if (workGroup.defaultPutCode.toString() === work.putCode.value) {
                this.works.push(work)
              }
            })
          })
          this.loadingWorks = false
        })
    } else {
      if (this.putCodes?.length > 0) {
        this.putCodes.forEach((putCode) => {
          this._recordWorksService
            .getWorkInfo(putCode)
            .subscribe((work: Work) => {
              this.works.push(work)
            })
          this.loadingWorks = false
        })
      } else {
        this.loadingWorks = false
      }
    }
  }

  saveEvent() {
    if (this.selectedAll) {
      this.loadingWorks = true
      this._recordWorksService.export().subscribe((data) => {
        this.createTxtFile(data)
        this.closeEvent()
      })
    } else {
      if (this.putCodes?.length > 0) {
        this.loadingWorks = true
        this._recordWorksService
          .exportSelected(this.putCodes)
          .subscribe((data) => {
            this.createTxtFile(data)
            this.closeEvent()
          })
      }
    }
  }

  createTxtFile(data) {
    if ((this.window.navigator as any)?.msSaveOrOpenBlob) {
      const fileData = [data]
      const blobObject = new Blob(fileData, { type: 'text/plain' })
      ;(this.window.navigator as any).msSaveOrOpenBlob(blobObject, 'works.bib')
    } else {
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
  }

  closeEvent() {
    this.dialogRef.close()
  }

  ngOnDestroy() {
    this.$destroy.next(true)
    this.$destroy.unsubscribe()
  }
}
