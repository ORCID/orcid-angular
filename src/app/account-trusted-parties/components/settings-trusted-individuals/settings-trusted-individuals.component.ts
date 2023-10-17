import { Component, OnDestroy, OnInit } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { Observable, of, Subject } from 'rxjs'
import { startWith, switchMap, takeUntil, tap } from 'rxjs/operators'
import { PlatformInfoService } from 'src/app/cdk/platform-info'
import { AccountTrustedIndividualsService } from 'src/app/core/account-trusted-individuals/account-trusted-individuals.service'
import { AccountTrustedIndividual } from 'src/app/types/account-trusted-individuals'
import { environment } from 'src/environments/environment'

import { DialogRevokeTrustedIndividualsComponent } from '../dialog-revoke-trusted-individuals/dialog-revoke-trusted-individuals.component'

@Component({
  selector: 'app-settings-trusted-individuals',
  templateUrl: './settings-trusted-individuals.component.html',
  styleUrls: [
    './settings-trusted-individuals.component.scss',
    './settings-trusted-individuals.component.scss-theme.scss',
  ],
})
export class SettingsTrustedIndividualsComponent implements OnInit, OnDestroy {
  $trustedIndividuals: Observable<AccountTrustedIndividual[]>
  displayedColumns = ['trustedIndividuals', 'orcid', 'granted', 'actions']
  platformSubs = new Subject<void>()
  isMobile: boolean
  baseUrl = environment.BASE_URL
  trustedPartiesUrl = '/trusted-parties'
  constructor(
    private _trustedIndividualsService: AccountTrustedIndividualsService,
    private dialog: MatDialog,
    private _platform: PlatformInfoService
  ) {}
  ngOnDestroy(): void {
    this.platformSubs.next()
    this.platformSubs.complete()
  }

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
    this.$trustedIndividuals =
      this._trustedIndividualsService.updateTrustedIndividualsSuccess.pipe(
        startWith(() => undefined),
        switchMap(() => this._trustedIndividualsService.get())
      )
  }

  revokeAccess(accountTrustedOrganization: AccountTrustedIndividual) {
    this.dialog
      .open(DialogRevokeTrustedIndividualsComponent, {
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
