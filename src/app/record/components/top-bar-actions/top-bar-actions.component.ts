import { Component, Inject, Input, OnDestroy, OnInit } from '@angular/core'
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'
import { PlatformInfo, PlatformInfoService } from 'src/app/cdk/platform-info'
import { UserRecord } from '../../../types/record.local'
import { WINDOW } from '../../../cdk/window'
import { UserStatus } from '../../../types/userStatus.endpoint'

@Component({
    selector: 'app-top-bar-actions',
    templateUrl: './top-bar-actions.component.html',
    styleUrls: ['./top-bar-actions.component.scss'],
    standalone: false
})
export class TopBarActionsComponent implements OnInit, OnDestroy {
  labelPrintableVersion = $localize`:@@topBar.ariaLabelPrintableVersion:View printable version (Opens of a different tab)`
  labelIsThisYou = $localize`:@@topBar.isThisYou:Is this you?`
  labelSignInToStart =
    $localize`:@@topBar.isThisYou:Is this you?` +
    ' ' +
    $localize`:@@topBar.signInToStart:Sign in to start editing`

  $destroy: Subject<void> = new Subject<void>()
  platform: PlatformInfo
  @Input() userRecord: UserRecord
  @Input() ariaLabelName: string
  @Input() userStatus: UserStatus
  @Input() isPublicRecord: string
  @Input() showPrintButton = false
  @Input() showIsThisYouButton = false
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
      runtimeEnvironment.BASE_URL +
        this.userRecord?.userInfo?.EFFECTIVE_USER_ORCID +
        '/print'
    )
  }
}
