import { Component, Inject, OnDestroy, OnInit } from '@angular/core'
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'
import { WINDOW } from 'src/app/cdk/window'
import { UserService } from 'src/app/core'
import { TogglzService } from 'src/app/core/togglz/togglz.service'

@Component({
    selector: 'app-account-settings',
    templateUrl: './account-settings.component.html',
    styleUrls: ['./account-settings.component.scss'],
    standalone: false
})
export class AccountSettingsComponent implements OnInit, OnDestroy {
  userInfo: any
  $destroy = new Subject<void>()
  constructor(
    private _togglz: TogglzService,
    private _userSession: UserService,
    @Inject(WINDOW) private window: Window
  ) {}

  ngOnInit(): void {
    this.observeSessionUpdates()
  }
  ngOnDestroy(): void {
    this.$destroy.next()
    this.$destroy.complete()
  }

  private observeSessionUpdates() {
    this._userSession
      .getUserSession()
      .pipe(takeUntil(this.$destroy))
      .subscribe((value) => {
        if (!value.userInfo) {
          this.window.location.reload()
        }
      })
  }
}
