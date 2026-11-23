import { HttpClient } from '@angular/common/http'
import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { take } from 'rxjs/operators'
import { UserService } from '../core'
import { DelegateInvitationActionService } from '../core/delegate-invitation-action/delegate-invitation-action.service'

@Component({
  selector: 'app-delegate-invitation',
  standalone: true,
  template: `<p i18n="@@delegateInvitation.processing">
    Processing delegate invitation...
  </p>`,
})
export class DelegateInvitationComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private user: UserService,
    private actions: DelegateInvitationActionService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token')
    const decision = this.route.snapshot.queryParamMap.get('decision')
    if (!this.actions.valid(token, decision)) {
      this.actions.clear()
      this.router.navigate(['/trusted-parties'], {
        queryParams: { invitationResponse: 'INVALID' },
        replaceUrl: true,
      })
      return
    }

    this.user
      .getUserSession()
      .pipe(take(1))
      .subscribe((session) => {
        if (!session.loggedIn) {
          this.actions.save({ token, decision })
          this.router.navigate(['/signin'], { replaceUrl: true })
          return
        }

        this.http
          .post<{ status: string }>(
            runtimeEnvironment.API_WEB +
              'account/delegate-invitations/respond.json',
            {
              invitationToken: token,
              decision,
            }
          )
          .pipe(take(1))
          .subscribe({
            next: (result) => this.finish(result.status),
            error: () => this.finish('ERROR'),
          })
      })
  }

  private finish(status: string): void {
    this.actions.clear()
    this.router.navigate(['/trusted-parties'], {
      queryParams: { invitationResponse: status },
      replaceUrl: true,
    })
  }
}
