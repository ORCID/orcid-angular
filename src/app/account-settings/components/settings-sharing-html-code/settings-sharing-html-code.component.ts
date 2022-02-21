import { Component, EventEmitter, OnInit, Output } from '@angular/core'
import { take } from 'rxjs/operators'
import { UserService } from 'src/app/core'
import { UserSession } from 'src/app/types/session.local'
import { environment } from 'src/environments/environment'

@Component({
  selector: 'app-settings-sharing-html-code',
  templateUrl: './settings-sharing-html-code.component.html',
  styleUrls: ['./settings-sharing-html-code.component.scss'],
})
export class SettingsSharingHtmlCodeComponent implements OnInit {
  @Output() loading = new EventEmitter<boolean>()
  userSession: UserSession
  baseUrl = environment.BASE_URL

  constructor(private _user: UserService) {}

  ngOnInit(): void {
    this._user
      .getUserSession()
      .pipe(take(1))
      .subscribe((userSession) => {
        this.userSession = userSession
      })
  }
}
