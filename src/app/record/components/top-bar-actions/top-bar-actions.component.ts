import { Component, Inject, Input, OnDestroy, OnInit } from '@angular/core'
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'
import { PlatformInfo, PlatformInfoService } from 'src/app/cdk/platform-info'
import { UserRecord } from '../../../types/record.local'
import { environment } from '../../../../environments/environment'
import { WINDOW } from '../../../cdk/window'
import { UserStatus } from '../../../types/userStatus.endpoint'

@Component({
  selector: 'app-top-bar-actions',
  templateUrl: './top-bar-actions.component.html',
  styleUrls: ['./top-bar-actions.component.scss'],
})
export class TopBarActionsComponent implements OnInit, OnDestroy {
  $destroy: Subject<boolean> = new Subject<boolean>()
  platform: PlatformInfo
  @Input() userRecord: UserRecord
  @Input() userStatus: UserStatus
  @Input() isPublicRecord: string
  @Input() onlyShowPrintButton = false
  @Input() onlyShowIsThisYouButton = false
  constructor(
    @Inject(WINDOW) private window: Window,
    _platform: PlatformInfoService
  ) {
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

  printRecord() {
    this.window.open(
      environment.BASE_URL +
        this.userRecord?.userInfo?.EFFECTIVE_USER_ORCID +
        '/print'
    )
  }
}
