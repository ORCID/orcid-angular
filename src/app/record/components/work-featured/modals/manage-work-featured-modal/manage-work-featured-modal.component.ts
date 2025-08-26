import {
  CdkDragDrop,
  CdkDragEnd,
  CdkDragStart,
  moveItemInArray,
} from '@angular/cdk/drag-drop'
import { Component, Inject, Input, OnDestroy, OnInit } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'
import { ModalComponent } from 'src/app/cdk/modal/modal/modal.component'
import { RecordWorksService } from 'src/app/core/record-works/record-works.service'
import { Work } from 'src/app/types/record-works.endpoint'
import { UserRecord } from 'src/app/types/record.local'

@Component({
  selector: 'app-manage-work-featured-modal',
  templateUrl: './manage-work-featured-modal.component.html',
  styleUrls: [
    './manage-work-featured-modal.component.scss-theme.scss',
    './manage-work-featured-modal.component.scss',
  ],
  standalone: false,
})
export class ManageWorkFeaturedModalComponent implements OnInit, OnDestroy {
  closeLabel = $localize`:@@shared.closeActivityAriaLabel:Close Works`
  cancelAndClose = $localize`:@@shared.cancelAndCloseActivityAriaLabel:Cancel changes and close Works`
  saveAndClose = $localize`:@@shared.saveAndCloseActivityAriaLabel:Save changes to Works`

  @Input() userRecord: UserRecord

  loading = true
  works: Work[] = []
  initialPutCodes: string[] = []
  maxFeatured = 5

  $destroy: Subject<void> = new Subject<void>()

  // Height of the currently dragged item so the placeholder reserves the same space
  draggedItemHeight: number | null = null

  constructor(
    private _worksService: RecordWorksService,
    private _dialogRef: MatDialogRef<ModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: UserRecord
  ) {}

  ngOnInit(): void {
    this._worksService
      .getFeaturedWorks({})
      .pipe(takeUntil(this.$destroy))
      .subscribe((works) => {
        this.works = (works || []).slice(0)
        this.initialPutCodes = (works || []).map((w) => w.putCode?.value)
        this.loading = false
      })
  }

  ngOnDestroy(): void {
    this.$destroy.next()
    this.$destroy.unsubscribe()
  }

  drop(event: CdkDragDrop<Work[]>) {
    moveItemInArray(this.works, event.previousIndex, event.currentIndex)
  }

  dragStarted(event: CdkDragStart) {
    // Determine the height of the dragged item to apply to the placeholder
    const rootEl: HTMLElement = (
      typeof (event as any).source.getRootElement === 'function'
        ? (event as any).source.getRootElement()
        : (event as any).source.element.nativeElement
    ) as HTMLElement
    const rect = rootEl.getBoundingClientRect()
    this.draggedItemHeight = Math.ceil(rect.height)
  }

  dragEnded(_event: CdkDragEnd) {
    this.draggedItemHeight = null
  }

  remove(work: Work) {
    this.works = this.works.filter(
      (w) => w.putCode?.value !== work.putCode?.value
    )
  }

  saveEvent() {
    // Build map of putCode -> index (1-based). Include deleted putCodes with null.
    const currentOrderMap: { [putCode: string]: number | undefined } = {}
    this.works.forEach((w, idx) => {
      currentOrderMap[w.putCode?.value] = idx + 1
    })

    // Ensure removed items are included with null using locally stored initial list
    this.initialPutCodes.forEach((pc) => {
      if (!(pc in currentOrderMap)) {
        // explicitly send null to indicate deletion
        ;(currentOrderMap as any)[pc] = null
      }
    })

    this._worksService
      .updateFeaturedWorks(currentOrderMap, true)
      .pipe(takeUntil(this.$destroy))
      .subscribe((ok) => {
        this._dialogRef.close(currentOrderMap)
      })
  }

  closeEvent() {
    this._dialogRef.close()
  }
}
