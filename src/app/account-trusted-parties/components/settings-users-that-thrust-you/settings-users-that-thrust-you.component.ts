import { Component, OnDestroy, OnInit } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { ActivatedRoute, Router } from '@angular/router'
import { Observable, of, Subject } from 'rxjs'
import { startWith, switchMap, takeUntil } from 'rxjs/operators'
import { PlatformInfoService } from 'src/app/cdk/platform-info'
import { TrustedIndividualsService } from 'src/app/core/trusted-individuals/trusted-individuals.service'
import {
  TrustedIndividuals,
  Delegator,
} from 'src/app/types/trusted-individuals.endpoint'
import { DialogRevokeYourOwnPermissionsComponent } from '../dialog-revoke-your-own-permissions/dialog-revoke-your-own-permissions.component'

@Component({
  selector: 'app-settings-users-that-thrust-you',
  templateUrl: './settings-users-that-thrust-you.component.html',
  styleUrls: [
    './settings-users-that-thrust-you.component.scss',
    './settings-users-that-thrust-you.component.scss-theme.scss',
  ],
  standalone: false,
})
export class SettingsUsersThatThrustYouComponent implements OnInit {
  $usersThatThrustYou: Observable<TrustedIndividuals>
  displayedColumns = ['trustedIndividuals', 'orcid', 'granted', 'actions']
  platformSubs = new Subject<void>()
  isMobile: boolean
  baseUrl = runtimeEnvironment.BASE_URL
  trustedPartiesUrl = '/trusted-parties'
  responseStatus: string
  responseSenderName: string
  responseSenderOrcid: string
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private _trustedIndividualsService: TrustedIndividualsService,
    private dialog: MatDialog,
    private _platform: PlatformInfoService
  ) {}

  ngOnInit(): void {
    const response = this.route.snapshot.queryParamMap.get('invitationResponse')
    if (response) {
      this.responseStatus = response
      this.responseSenderName =
        this.route.snapshot.queryParamMap.get('senderName')
      this.responseSenderOrcid =
        this.route.snapshot.queryParamMap.get('senderOrcid')
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: {
          invitationResponse: null,
          senderName: null,
          senderOrcid: null,
        },
        queryParamsHandling: 'merge',
        replaceUrl: true,
      })
    }
    this.setupTrustedIndividualsObs()
    this._platform
      .get()
      .pipe(takeUntil(this.platformSubs))
      .subscribe((platform) => {
        this.isMobile = platform.columns4 || platform.columns8
      })
  }

  private setupTrustedIndividualsObs() {
    this.$usersThatThrustYou =
      this._trustedIndividualsService.updateDelegatorSuccess.pipe(
        startWith(() => undefined),
        switchMap(() => this._trustedIndividualsService.getTrustedIndividuals())
      )
  }

  revokeAccess(accountTrustedOrganization: Delegator) {
    this.dialog
      .open(DialogRevokeYourOwnPermissionsComponent, {
        data: accountTrustedOrganization,
      })
      .afterClosed()
      .pipe(
        switchMap((value) => {
          if (value) {
            return this._trustedIndividualsService.delete(value)
          } else {
            of(undefined)
          }
        })
      )
      .subscribe()
  }
}
