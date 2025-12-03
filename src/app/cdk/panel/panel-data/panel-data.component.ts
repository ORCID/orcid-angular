import { Component, HostBinding, Input, OnDestroy, OnInit } from '@angular/core'
import { takeUntil } from 'rxjs/operators'
import { PlatformInfoService } from '../../platform-info'
import { Subject } from 'rxjs'

@Component({
  selector: 'app-panel-data',
  templateUrl: './panel-data.component.html',
  styleUrls: [
    './panel-data.component.scss',
    './panel-data.component.scss-theme.scss',
  ],
  standalone: false,
})
export class PanelDataComponent implements OnInit, OnDestroy {
  $destroy: Subject<boolean> = new Subject<boolean>()

  @HostBinding('class.orc-font-body-small') fontSmall = true
  @HostBinding('class.border-bottom') borderBottomClass = false
  @HostBinding('class.featured') featuredClass = false
  @HostBinding('class.no-padding') noPaddingClass = true

  @Input() set featured(featured: boolean) {
    this.featuredClass = featured
  }
  /**
   * @deprecated The borderBottom input is deprecated. The divider is now applied to the orcid-panel__footer.
   * This input will be removed in a future version.
   */
  @Input() set borderBottom(borderBottom: boolean) {
    this.borderBottomClass = borderBottom
  }
  /**
   * @deprecated This attribute enables legacy padding (16px).
   * Defaults to false (no padding) for new implementations.
   * Set to true to enable the deprecated 16px padding for backward compatibility.
   */
  @Input() set deprecatedPadding(enablePadding: boolean) {
    this.noPaddingClass = !enablePadding
  }

  state = false
  isMobile: boolean

  constructor(private _platform: PlatformInfoService) {}

  ngOnInit(): void {
    this._platform
      .get()
      .pipe(takeUntil(this.$destroy))
      .subscribe((platform) => {
        this.isMobile = platform.columns4 || platform.columns8
      })
  }

  ngOnDestroy() {
    this.$destroy.next(true)
    this.$destroy.unsubscribe()
  }
}
