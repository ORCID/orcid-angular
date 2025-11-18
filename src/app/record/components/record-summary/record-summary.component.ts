import { CommonModule } from '@angular/common'
import {
  Component,
  ElementRef,
  HostBinding,
  HostListener,
  OnDestroy,
  OnInit,
} from '@angular/core'
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'
import { RecordHeaderStateService } from 'src/app/core/record-header-state/record-header-state.service'
import { HeaderCompactService } from 'src/app/core/header-compact/header-compact.service'
import { RecordUtil } from 'src/app/shared/utils/record.util'
import { TrustedSummaryModule } from 'src/app/cdk/trusted-summary/trusted-summary.module'

@Component({
  selector: 'app-record-summary',
  templateUrl: './record-summary.component.html',
  styleUrls: ['./record-summary.component.scss'],
  standalone: true,
  imports: [CommonModule, TrustedSummaryModule],
})
export class RecordSummaryComponent implements OnInit, OnDestroy {
  private readonly $destroy = new Subject<void>()
  private scrollPositionRestored = false
  private savedScrollPosition = 0

  recordSummaryOpen = false
  compactMode = false

  ariaLabelFindoutMore = RecordUtil.appendOpensInNewTab(
    $localize`:@@summary.findOutMoreAboutRecordSummaries:Find out more about record summaries`
  )

  // Hide the component when summary is closed using CSS instead of destroying it
  @HostBinding('style.display') get display() {
    return this.recordSummaryOpen ? 'block' : 'none'
  }

  // Apply compact mode class for max-height restriction
  @HostBinding('class.compact-mode') get isCompactMode() {
    return this.compactMode
  }

  // Listen to scroll events and save position to state
  @HostListener('scroll', ['$event'])
  onScroll() {
    const scrollTop = this._elementRef.nativeElement.scrollTop
    this._state.setRecordSummaryScrollPosition(scrollTop)
  }

  constructor(
    private _state: RecordHeaderStateService,
    private _compact: HeaderCompactService,
    private _elementRef: ElementRef
  ) {}

  ngOnInit(): void {
    this._state.recordSummaryOpen$
      .pipe(takeUntil(this.$destroy))
      .subscribe((open) => {
        this.recordSummaryOpen = !!open
        // Restore scroll position when component becomes visible
        if (open && !this.scrollPositionRestored) {
          this.restoreScrollPosition()
        }
      })

    this._compact.compactActive$
      .pipe(takeUntil(this.$destroy))
      .subscribe((active) => {
        this.compactMode = !!active
      })

    // Subscribe to scroll position changes from state
    this._state.recordSummaryScrollPosition$
      .pipe(takeUntil(this.$destroy))
      .subscribe((position) => {
        this.savedScrollPosition = position
          this.restoreScrollPosition()
        
      })
  }

  private restoreScrollPosition(): void {
    // Use setTimeout to ensure DOM is ready
    setTimeout(() => {
      if (this.savedScrollPosition) {
        this._elementRef.nativeElement.scrollTop = this.savedScrollPosition
      }
      this.scrollPositionRestored = true
    }, 0)
  }

  ngOnDestroy(): void {
    this.$destroy.next()
    this.$destroy.complete()
  }
}
