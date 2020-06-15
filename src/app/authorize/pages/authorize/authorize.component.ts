import { Component, OnInit, Inject, OnDestroy } from '@angular/core'
import { WINDOW } from 'src/app/cdk/window'
import { OauthService } from 'src/app/core/oauth/oauth.service'
import {
  RequestInfoForm,
  ScopesStrings,
} from 'src/app/types/request-info-form.endpoint'
import { UserService } from 'src/app/core'
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'

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
    // _oauth.loadRequestInfoForm().subscribe((data) => {
    this.oauthRequest = {
      errors: [],
      scopes: [
        {
          name: 'READ_LIMITED',
          value: '/read-limited',
          description:
            'Read your information with visibility set to Trusted Parties',
          longDescription: `Allow this organization or application to read any information from your record you have marked
            as limited access. They cannot read information you have marked as private.`,
        },
        {
          name: 'OPENID',
          value: 'openid',
          description: 'Get your ORCID iD',
          longDescription: `Allow this organization or application to get your 16-character ORCID iD and read information on
            your ORCID record you have marked as public.`,
        },
        {
          name: 'AUTHENTICATE',
          value: '/authenticate',
          description: 'Get your ORCID iD',
          longDescription: `Allow this organization or application to get your 16-character ORCID iD and read
            information on your ORCID record you have marked as public.`,
        },
        {
          name: 'ACTIVITIES_UPDATE',
          value: '/activities/update',
          description:
            'Add/update your research activities (works, affiliations, etc)',
          longDescription: `Allow this organization or application to add information about your research activities
             (for example, works, affiliations) that is stored in their system(s) to your ORCID record.
             They will also be able to update this and any other information they have added, but will not be
              able to edit information added by you or by another trusted organization.`,
        },
      ],
      clientDescription: 'https://developers.google.com/oauthplayground\t',
      clientId: 'APP-MLXS7JVFJS9FEIFJ',
      clientName: 'test',
      clientEmailRequestReason: '',
      memberName: 'asda',
      redirectUrl: 'https://developers.google.com/oauthplayground',
      responseType: 'code',
      stateParam: null,
      userId: null,
      userName: 'Leo Mendoza',
      userOrcid: '0000-0002-9361-1905',
      userEmail: null,
      userGivenNames: null,
      userFamilyNames: null,
      nonce: null,
      clientHavePersistentTokens: true,
      scopesAsString: '/read-limited openid /authenticate /activities/update',
    }
    // })

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
