import { Component, OnDestroy, OnInit } from '@angular/core'
import { Observable, Subject } from 'rxjs'
import { take, takeUntil } from 'rxjs/operators'
import { PlatformInfo, PlatformInfoService } from 'src/app/cdk/platform-info'
import { AnnouncerService } from 'src/app/core/announcer/announcer.service'
import { RecordCorrectionsService } from 'src/app/core/record-corrections/record-corrections.service'
import {
  RecordCorrection,
  RecordCorrectionsPage,
} from 'src/app/types/record-corrections.endpoint'

@Component({
  selector: 'app-record-corrections',
  templateUrl: './record-corrections.component.html',
  styleUrls: [
    './record-corrections.component.scss',
    './record-corrections.component.scss-theme.scss',
  ],
  preserveWhitespaces: true,
  standalone: false,
})
export class RecordCorrectionsComponent implements OnInit, OnDestroy {
  $destroy = new Subject<void>()
  currentPage: RecordCorrectionsPage
  loading = true
  error = false
  isMobile: boolean
  platform: PlatformInfo

  itemTypeLabel = $localize`:@@recordCorrections.itemType:record corrections`
  noCorrectionsLabel = $localize`:@@recordCorrections.noCorrections:No corrections to report`
  errorLabel = $localize`:@@recordCorrections.error:The list of record corrections could not be loaded.`
  paginationLabel = $localize`:@@recordCorrections.pagination:Record corrections pagination`

  // The backend serves a fixed page of 10, so the skeleton mirrors a full page.
  skeletonRows = new Array(10)

  private lastRequest: () => Observable<RecordCorrectionsPage>

  constructor(
    private _recordCorrections: RecordCorrectionsService,
    private _platform: PlatformInfoService,
    private _announcer: AnnouncerService
  ) {}

  ngOnInit(): void {
    this._platform
      .get()
      .pipe(takeUntil(this.$destroy))
      .subscribe((platform) => {
        this.platform = platform
        this.isMobile = platform.columns4 || platform.columns8
      })

    this.loadPage(() => this._recordCorrections.getNextPage())
  }

  get corrections(): RecordCorrection[] {
    return this.currentPage?.recordCorrections || []
  }

  get isEmpty(): boolean {
    return this.corrections.length === 0
  }

  get hasNext(): boolean {
    return !!this.currentPage?.haveNext
  }

  get hasPrevious(): boolean {
    return !!this.currentPage?.havePrevious
  }

  next(): void {
    const cursor = this.currentPage?.lastElementId
    if (
      this.loading ||
      !this.hasNext ||
      cursor === null ||
      cursor === undefined
    )
      return
    this.loadPage(() => this._recordCorrections.getNextPage(cursor))
  }

  previous(): void {
    const cursor = this.currentPage?.firstElementId
    if (
      this.loading ||
      !this.hasPrevious ||
      cursor === null ||
      cursor === undefined
    )
      return
    this.loadPage(() => this._recordCorrections.getPreviousPage(cursor))
  }

  retry(): void {
    if (this.lastRequest) {
      this.loadPage(this.lastRequest)
    }
  }

  private loadPage(request: () => Observable<RecordCorrectionsPage>): void {
    this.lastRequest = request
    this.loading = true
    this.error = false

    request()
      .pipe(take(1), takeUntil(this.$destroy))
      .subscribe({
        next: (page) => {
          this.currentPage = page
          this.loading = false
          this._announcer.liveAnnounce(
            this.isEmpty
              ? this.noCorrectionsLabel
              : `${this._announcer.showingLabel} ${this.corrections.length} ${this.itemTypeLabel}`
          )
        },
        error: () => {
          this.loading = false
          this.error = true
          this._announcer.liveAnnounce(this.errorLabel)
        },
      })
  }

  ngOnDestroy(): void {
    this.$destroy.next()
    this.$destroy.complete()
  }
}
