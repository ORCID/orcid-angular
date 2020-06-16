import { Component, OnInit, Inject, OnDestroy } from '@angular/core'
import { WINDOW } from 'src/app/cdk/window'
import { OauthService } from 'src/app/core/oauth/oauth.service'
import { RequestInfoForm } from 'src/app/types/request-info-form.endpoint'
import { UserService } from 'src/app/core'
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'
import { ScopesStrings } from 'src/app/types/common.endpoint'

@Component({
  selector: 'app-authorize',
  templateUrl: './authorize.component.html',
  styleUrls: ['./authorize.component.scss'],
  preserveWhitespaces: true,
})
export class AuthorizeComponent implements OnInit, OnDestroy {
  $destroy: Subject<boolean> = new Subject<boolean>()
  orcidUrl: string
  userName: string

  oauthRequest: RequestInfoForm
  constructor(
    @Inject(WINDOW) private window: Window,
    private _user: UserService,
    private _oauth: OauthService
  ) {
    _oauth.loadRequestInfoFormFromMemory().subscribe((data) => {
      this.oauthRequest = data
    })

    this._user
      .getUserInfoOnEachStatusUpdate()
      .pipe(takeUntil(this.$destroy))
      .subscribe((userInfo) => {
        this.userName = userInfo.displayName
        this.orcidUrl = userInfo.orcidUrl
      })
  }

  ngOnInit(): void {}

  navigateTo(val) {
    this.window.location.href = val
  }

  signout() {}

  authorize(value = true) {
    this._oauth.authorize(value).subscribe((data) => {
      this.navigateTo(data.redirectUrl)
    })
    // TODO @leomendoza123 handle error with toaster
  }

  getIconName(scope: ScopesStrings): string {
    if (scope.indexOf('update') >= 0) {
      return 'updateIcon' // Eye material iconname
    }
    if (scope === 'openid' || scope === '/authenticate') {
      return 'orcidIcon'
    }
    if (scope === '/read-limited') {
      return 'viewIcon'
    }
  }

  ngOnDestroy() {
    this.$destroy.next(true)
    this.$destroy.unsubscribe()
  }
}
