import { Component, Inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { MatIconModule } from '@angular/material/icon'
import { MatButtonModule } from '@angular/material/button'
import { MatTooltipModule } from '@angular/material/tooltip'
import { Router } from '@angular/router'
import { takeUntil } from 'rxjs/operators'
import { Subject } from 'rxjs'
import { UserService } from 'src/app/core'
import { RecordHeaderStateService } from 'src/app/core/record-header-state/record-header-state.service'
import { WINDOW } from 'src/app/cdk/window'
import { AccentButtonDirective } from '@orcid/ui'

@Component({
  selector: 'app-record-edit-button',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    AccentButtonDirective,
  ],
  templateUrl: 'record-edit-button.component.html',
  styleUrls: ['record-edit-button.component.scss'],
})
export class RecordEditButtonComponent {
  private readonly $destroy = new Subject<void>()
  visible = false
  tooltip = ''

  private isLoggedIn = false
  private loggedUserOrcid: string | undefined
  private publicOrcid: string | null = null

  constructor(
    private _router: Router,
    private _user: UserService,
    private _state: RecordHeaderStateService,
    @Inject(WINDOW) private window: Window
  ) {
    this._state.isPublicRecord$
      .pipe(takeUntil(this.$destroy))
      .subscribe((id) => {
        this.publicOrcid = id
        this.computeState()
      })
    this._user
      .getUserSession()
      .pipe(takeUntil(this.$destroy))
      .subscribe((session) => {
        const info = session?.userInfo
        this.isLoggedIn = !!info
        this.loggedUserOrcid = info?.EFFECTIVE_USER_ORCID
        this.computeState()
      })
  }

  private computeState() {
    const isOwner =
      !!this.publicOrcid &&
      !!this.loggedUserOrcid &&
      this.publicOrcid === this.loggedUserOrcid
    if (!this.isLoggedIn) {
      this.visible = true
      this.tooltip = $localize`:@@record.editTooltipSignIn:Is this you? Sign in to start editing your ORCID record`
      return
    }
    if (isOwner) {
      this.visible = true
      this.tooltip = $localize`:@@record.editYourOrcidRecord:Edit your ORCID record`
      return
    }
    this.visible = false
    this.tooltip = ''
  }

  onClick() {
    if (!this.isLoggedIn) {
      this._router.navigate(['signin'])
      return
    }
    // If owner, go to my-orcid
    this._router.navigate(['my-orcid'])
  }
}
