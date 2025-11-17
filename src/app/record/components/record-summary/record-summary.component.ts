import { CommonModule } from '@angular/common'
import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core'
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'
import { RecordHeaderStateService } from 'src/app/core/record-header-state/record-header-state.service'
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

  recordSummaryOpen = false

  ariaLabelFindoutMore = RecordUtil.appendOpensInNewTab(
    $localize`:@@summary.findOutMoreAboutRecordSummaries:Find out more about record summaries`
  )

  // Hide the component when summary is closed using CSS instead of destroying it
  @HostBinding('style.display') get display() {
    return this.recordSummaryOpen ? 'block' : 'none'
  }

  constructor(private _state: RecordHeaderStateService) {}

  ngOnInit(): void {
    this._state.recordSummaryOpen$
      .pipe(takeUntil(this.$destroy))
      .subscribe((open) => {
        this.recordSummaryOpen = !!open
      })
  }

  ngOnDestroy(): void {
    this.$destroy.next()
    this.$destroy.complete()
  }
}


