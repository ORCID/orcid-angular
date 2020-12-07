import { Component, Input, OnInit } from '@angular/core'
import { UserRecord } from '../../../types/record.local'
import { NameForm, RequestInfoForm, UserInfo } from '../../../types'

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: [
    './top-bar.component.scss',
    './top-bar.component.scss-theme.scss'
  ],
})
export class TopBarComponent implements OnInit {
  @Input() userSession: {
    userInfo: UserInfo
    nameForm: NameForm
    oauthSession: RequestInfoForm
    displayName: string
    orcidUrl: string
    loggedIn: boolean
  }
  @Input() userRecord: UserRecord

  constructor() {
  }

  ngOnInit(): void {}
}
