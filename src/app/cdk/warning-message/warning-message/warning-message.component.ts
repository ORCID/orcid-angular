import { Component, Input, OnDestroy, OnInit } from '@angular/core'
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'
import { PlatformInfoService } from '../../platform-info'

@Component({
  selector: 'app-warning-message',
  templateUrl: './warning-message.component.html',
  styleUrls: [
    './warning-message.component.scss',
    'warning-message.component.scss-theme.scss',
  ],
  preserveWhitespaces: false,
})
export class WarningMessageComponent implements OnInit, OnDestroy {
  @Input() icon = 'info'
  isMobile: boolean
  $destroy: Subject<boolean> = new Subject<boolean>()

  constructor(_platform: PlatformInfoService) {
    _platform
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
  ngOnInit(): void {}
}
