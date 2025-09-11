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
import { SnackbarService } from 'src/app/cdk/snackbar/snackbar.service'
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
  placeholderSearch = $localize`:@@works.searchPublicWorkTitles:Search public work titles`
  labelSearch = $localize`:@@layout.ariaLabelSearch:Search the ORCID registry`

  @Input() userRecord: UserRecord

  loading = true
  works: Work[] = []
  searchResults: Work[] | undefined
  initialPutCodes: string[] = []
  maxFeatured = 5
  whatToSearch: string
  totalWorks: number | undefined

  $destroy: Subject<void> = new Subject<void>()

  // Height of the currently dragged item so the placeholder reserves the same space
  draggedItemHeight: number | null = null

  constructor(
    private _worksService: RecordWorksService,
    private _dialogRef: MatDialogRef<ModalComponent>,
    private _snackbarService: SnackbarService,
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
    this.searchResults?.forEach((item) => {
      if (String(item.putCode.value) === String(work.putCode.value)) {
        item.featuredDisplayIndex = 0
      }
    })
  }

  search(term: string) {
    if (term) {
      this._worksService
        .searchPublicWorks(term)
        .subscribe((res: { results: Work[]; total: number }) => {
          const featuredPutCodes = new Set(
            this.works.map((w) => String(w.putCode?.value))
          )
          this.totalWorks = res.total
          this.searchResults = res.results.map((result) => ({
            ...result,
            featured: featuredPutCodes.has(String(result.putCode?.value)),
          }))
        })
    }
  }

  makeFeatured(work: Work) {
    if (this.works.length >= this.maxFeatured) {
      this._snackbarService.showValidationError(
        $localize`:@@works.maxFeaturedWorks:You can only feature up to 5 works.`,
        $localize`:@@works.maxFeaturedWorksToastDescription:You can’t feature any more works until you have removed some of the currently featured items.`
      )
      return
    }
    this.works.push(work)
    const searchResult = this.searchResults.find(
      (item) => String(item.putCode.value) === String(work.putCode.value)
    )
    if (searchResult) {
      // 1 is set to mark it as featured in the ui, actual index gets assigned in "saveEvent()"
      searchResult.featuredDisplayIndex = 1
    }
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
