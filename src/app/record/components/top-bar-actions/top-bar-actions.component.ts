import { Component, Input, OnDestroy, OnInit } from '@angular/core'
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'
import { PlatformInfo, PlatformInfoService } from 'src/app/cdk/platform-info'

@Component({
  selector: 'app-top-bar-actions',
  templateUrl: './top-bar-actions.component.html',
  styleUrls: ['./top-bar-actions.component.scss'],
})
export class TopBarActionsComponent implements OnInit, OnDestroy {
  $destroy: Subject<boolean> = new Subject<boolean>()
  platform: PlatformInfo
  @Input() isPublicRecord: string

  constructor(_platform: PlatformInfoService) {
    _platform
      .get()
      .pipe(takeUntil(this.$destroy))
      .subscribe((data) => {
        this.platform = data
      })
  }
  ngOnInit(): void {}
  ngOnDestroy(): void {
    this.$destroy.next()
  }
}
