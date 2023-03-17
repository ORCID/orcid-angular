import { Component, Inject, Input, OnInit } from '@angular/core'
import { UserService } from 'src/app/core'
import { environment } from 'src/environments/environment'
import { WINDOW } from '../../../cdk/window'

@Component({
  selector: 'app-logged-in',
  templateUrl: './logged-in.component.html',
  styleUrls: ['./logged-in.component.scss'],
})
export class LoggedInComponent implements OnInit {
  @Input() realUserOrcid: string
  @Input() displayName: string

  constructor(
    @Inject(WINDOW) private window: Window,
    private user: UserService
  ) {}

  ngOnInit() {}

  navigateTo(val) {    
    if (val === '/signout' && environment.proxyMode) {
      this.user.noRedirectLogout().subscribe()
    } else {
      this.window.location.href = val
    }
  }
}
