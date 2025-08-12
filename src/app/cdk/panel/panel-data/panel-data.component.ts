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
  @Input() set featured(featured: boolean) {
    this.featuredClass = featured
  }
  @Input() set borderBottom(borderBottom: boolean) {
    this.borderBottomClass = borderBottom
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
