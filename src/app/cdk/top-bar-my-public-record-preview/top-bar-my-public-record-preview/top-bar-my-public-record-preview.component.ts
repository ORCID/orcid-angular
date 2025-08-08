import { Component, Inject, Input, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { Observable } from 'rxjs'
import { startWith, switchMap } from 'rxjs/operators'
import { PlatformInfoService } from 'src/app/cdk/platform-info'
import { WINDOW } from 'src/app/cdk/window'
import { UserService } from 'src/app/core'
import { TrustedIndividualsService } from 'src/app/core/trusted-individuals/trusted-individuals.service'
import {
  Delegator,
  TrustedIndividuals,
} from 'src/app/types/trusted-individuals.endpoint'

@Component({
    selector: 'app-top-bar-my-public-record-preview',
    templateUrl: './top-bar-my-public-record-preview.component.html',
    styleUrls: [
        './top-bar-my-public-record-preview.component.scss',
        './top-bar-my-public-record-preview.component.scss-theme.scss',
    ],
    standalone: false
})
export class TopBarMyPublicRecordPreviewComponent implements OnInit {
  @Input() isPublicRecord: string
  iAmEditingThisRecord = false
  isMyRecord: boolean
  effectiveRecord: string
  $trustedIndividuals: Observable<TrustedIndividuals>
  loadingTrustedIndividuals: boolean
  loadingUserInfo: boolean

  regionStatusBar = $localize`:@@shared.statusBar:Status bar`

  constructor(
    _platform: PlatformInfoService,
    private _user: UserService,
    private router: Router,
    @Inject(WINDOW) private window: Window,
    private _trustedIndividuals: TrustedIndividualsService
  ) {}

  ngOnInit(): void {
    this._user.getUserSession().subscribe((value) => {
      if (value.userInfo) {
        this.iAmEditingThisRecord =
          value.userInfo.EFFECTIVE_USER_ORCID === this.isPublicRecord ||
          !this.isPublicRecord
        this.isMyRecord =
          value.userInfo.REAL_USER_ORCID === value.userInfo.EFFECTIVE_USER_ORCID
        this.effectiveRecord = value.userInfo.EFFECTIVE_USER_ORCID
      }
    })

    if (!this.isPublicRecord) {
      this.setupTrustedIndividualsObs()
    }
  }

  private setupTrustedIndividualsObs() {
    this.$trustedIndividuals =
      this._trustedIndividuals.updateDelegatorSuccess.pipe(
        startWith(() => undefined),
        switchMap(() => {
          return this._trustedIndividuals.getTrustedIndividuals()
        })
      )
  }

  goToMyRecord() {
    this.router.navigate(['/my-orcid'])
  }
  changeAccount(delegator: Delegator) {
    this.loadingTrustedIndividuals = true
    this._user.switchAccount(delegator).subscribe(() => {
      // TODO: SHOULD NOT BE REQUIRE TO RELOAD
      // the user session service should be updated
      // https://github.com/ORCID/orcid-angular/projects/1#card-61932970
      this.window.location.href = '/my-orcid'
    })
  }
}
