import { Component, OnDestroy, OnInit } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { ActivatedRoute, Router } from '@angular/router'
import { merge, Observable, of, Subject } from 'rxjs'
import { startWith, switchMap, takeUntil, tap } from 'rxjs/operators'
import { PlatformInfoService } from 'src/app/cdk/platform-info'
import { AccountTrustedIndividualsService } from 'src/app/core/account-trusted-individuals/account-trusted-individuals.service'
import { AccountTrustedIndividual } from 'src/app/types/account-trusted-individuals'

import { DialogRevokeTrustedIndividualsComponent } from '../dialog-revoke-trusted-individuals/dialog-revoke-trusted-individuals.component'

@Component({
  selector: 'app-settings-trusted-individuals',
  templateUrl: './settings-trusted-individuals.component.html',
  styleUrls: [
    './settings-trusted-individuals.component.scss',
    './settings-trusted-individuals.component.scss-theme.scss',
  ],
  standalone: false,
})
export class SettingsTrustedIndividualsComponent implements OnInit, OnDestroy {
  $trustedIndividuals: Observable<AccountTrustedIndividual[]>
  notices: {
    invitationToken: string
    status: string
    lookupType: string
    enteredEmail?: string
  }[] = []
  responseStatus: string
  noticeLoadError = false
  private refreshRequested = new Subject<void>()
  displayedColumns = ['trustedIndividuals', 'orcid', 'granted', 'actions']
  platformSubs = new Subject<void>()
  isMobile: boolean
  baseUrl = runtimeEnvironment.BASE_URL
  trustedPartiesUrl = '/trusted-parties'
  constructor(
    private _trustedIndividualsService: AccountTrustedIndividualsService,
    private dialog: MatDialog,
    private _platform: PlatformInfoService,
    private route: ActivatedRoute,
    private router: Router
  ) {}
  ngOnDestroy(): void {
    this.platformSubs.next()
    this.platformSubs.complete()
    this.refreshRequested.complete()
  }

  ngOnInit(): void {
    this.setupTrustedIndividualsObs()
    this.loadNotices()
    const response = this.route.snapshot.queryParamMap.get('invitationResponse')
    if (response) {
      this.responseStatus = response
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { invitationResponse: null },
        queryParamsHandling: 'merge',
        replaceUrl: true,
      })
    }
    this._platform
      .get()
      .pipe(takeUntil(this.platformSubs))
      .subscribe((platform) => {
        this.isMobile = platform.columns4 || platform.columns8
      })
  }

  private setupTrustedIndividualsObs() {
    this.$trustedIndividuals = merge(
      this._trustedIndividualsService.updateTrustedIndividualsSuccess,
      this.refreshRequested
    ).pipe(
      startWith(() => undefined),
      switchMap(() => this._trustedIndividualsService.get())
    )
  }

  refresh(): void {
    this.refreshRequested.next()
    this.loadNotices()
  }

  private loadNotices(): void {
    this._trustedIndividualsService
      .getInvitationNotices()
      .pipe(takeUntil(this.platformSubs))
      .subscribe({
        next: (notices) => {
          this.notices = notices
          this.noticeLoadError = false
        },
        error: () => (this.noticeLoadError = true),
      })
  }

  acknowledgeNotice(token: string): void {
    this._trustedIndividualsService
      .acknowledgeInvitationNotice(token)
      .pipe(takeUntil(this.platformSubs))
      .subscribe({
        next: (result) => {
          if (result.status === 'ACKNOWLEDGED') {
            this.notices = this.notices.filter(
              (notice) => notice.invitationToken !== token
            )
          } else {
            this.noticeLoadError = true
          }
        },
        error: () => (this.noticeLoadError = true),
      })
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
