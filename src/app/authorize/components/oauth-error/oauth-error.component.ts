import { Component, Input, OnInit } from '@angular/core'
import { Subject } from 'rxjs'
import { map, takeUntil } from 'rxjs/operators'
import { UserService } from 'src/app/core'

@Component({
  selector: 'app-oauth-error',
  templateUrl: './oauth-error.component.html',
  styleUrls: ['./oauth-error.component.scss'],
})
export class OauthErrorComponent implements OnInit {
  @Input() errorDescription: string
  $destroy: Subject<boolean> = new Subject<boolean>()

  error = ''

  constructor(private _user: UserService) {
    this._user
      .getUserSession()
      .pipe(takeUntil(this.$destroy))
      .subscribe((userInfo) => {
        this.error = userInfo.oauthSession.error
      })
  }

  ngOnInit(): void {}

  ngOnDestroy() {
    this.$destroy.next(true)
    this.$destroy.unsubscribe()
  }
}
