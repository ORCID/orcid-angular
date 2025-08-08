import { Component, HostBinding, Input, OnDestroy, OnInit } from '@angular/core'
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'
import { PlatformInfoService } from 'src/app/cdk/platform-info'

@Component({
    selector: 'app-settings-panels-data',
    templateUrl: './settings-panels-data.component.html',
    styleUrls: [
        './settings-panels-data.component.scss',
        './settings-panels-data.component.scss-theme.scss',
    ],
    standalone: false
})
export class SettingsPanelsDataComponent implements OnInit, OnDestroy {
  $destroy: Subject<boolean> = new Subject<boolean>()

  @HostBinding('class.orc-font-body-small') fontSmall = true
  @HostBinding('class.border-bottom') borderBottomClass = true
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
