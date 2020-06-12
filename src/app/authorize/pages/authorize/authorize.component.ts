import { Component, OnInit, Inject } from '@angular/core'
import { WINDOW } from 'src/app/cdk/window'
import { OauthService } from 'src/app/core/oauth/oauth.service'
import { RequestInfoForm } from 'src/app/types/request-info-form.endpoint'

@Component({
  selector: 'app-authorize',
  templateUrl: './authorize.component.html',
  styleUrls: ['./authorize.component.scss'],
  preserveWhitespaces: true,
})
export class AuthorizeComponent implements OnInit {
  isATrustedIndividual = true
  alternativeAccounts = ['test', 'test2']
  oauthRequest: RequestInfoForm
  constructor(
    @Inject(WINDOW) private window: Window,
    private _oauth: OauthService
  ) {
    // _oauth.loadRequestInfoForm().subscribe((data) => {
    this.oauthRequest = {
      errors: [],
      scopes: [
        {
          name: 'OPENID',
          value: 'openid',
          description: 'Get your ORCID iD',
          longDescription: `Allow this organization or application to get your 16-character ORCID iD and read information
              on your ORCID record you have marked as public.`,
        },
        {
          name: 'AUTHENTICATE',
          value: '/authenticate',
          description: 'Get your ORCID iD',
          longDescription: `Allow this organization or application to get your 16-character ORCID iD and read
               information on your ORCID record you have marked as public.`,
        },
      ],
      clientDescription: 'https://developers.google.com/oauthplayground',
      clientId: 'APP-DSQQ3PKJZTJOGGW9',
      clientName: 'Test app',
      clientEmailRequestReason: '',
      memberName: 'asdasd',
      redirectUrl: 'https://developers.google.com/oauthplayground',
      responseType: 'code',
      stateParam: null,
      userId: null,
      userName: 'Leo Mendoza',
      userOrcid: '0000-0002-8664-9331',
      userEmail: null,
      userGivenNames: null,
      userFamilyNames: null,
      nonce: null,
      clientHavePersistentTokens: true,
      scopesAsString: 'openid /authenticate',
    }
    // })
  }

  ngOnInit(): void {}

  navigateTo(val) {
    this.window.location.href = val
  }

  changeAccount() {
    throw new Error('Unimplemented')
  }

  signout() {}
}
