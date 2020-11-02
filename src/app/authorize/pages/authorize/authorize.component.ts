import { Component, OnInit } from '@angular/core'
import { UserService } from 'src/app/core'

@Component({
  templateUrl: './authorize.component.html',
  styleUrls: ['./authorize.component.scss'],
  preserveWhitespaces: true,
})
export class AuthorizeComponent implements OnInit {
  showAuthorizationComponent: boolean
  constructor(_user: UserService) {
    _user.getUserSession().subscribe((session) => {
      if (session.oauthSession && session.oauthSession.error) {
        this.showAuthorizationComponent = false
      } else {
        this.showAuthorizationComponent = true
      }
    })
  }

  ngOnInit(): void {}
}
