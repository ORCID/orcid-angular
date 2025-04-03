import { Component, OnDestroy, OnInit } from '@angular/core'
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog'
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
})
export class SettingsUsersThatThrustYouComponent implements OnInit {
  $usersThatThrustYou: Observable<TrustedIndividuals>
  displayedColumns = ['trustedIndividuals', 'orcid', 'granted', 'actions']
  platformSubs = new Subject<void>()
  isMobile: boolean
  baseUrl = runtimeEnvironment.BASE_URL
  trustedPartiesUrl = '/trusted-parties'
  constructor(
    private _trustedIndividualsService: TrustedIndividualsService,
    private dialog: MatDialog,
    private _platform: PlatformInfoService
  ) {}

  ngOnInit(): void {
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
