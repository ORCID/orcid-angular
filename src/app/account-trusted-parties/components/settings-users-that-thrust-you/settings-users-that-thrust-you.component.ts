import { Component, OnDestroy, OnInit } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { Observable, Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'
import { PlatformInfoService } from 'src/app/cdk/platform-info'
import { TrustedIndividualsService } from 'src/app/core/trusted-individuals/trusted-individuals.service'
import { TrustedIndividuals } from 'src/app/types/trusted-individuals.endpoint'
import { environment } from 'src/environments/environment'

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
  displayedColumns = ['trustedIndividuals', 'orcid', 'granted']
  platformSubs = new Subject<void>()
  isMobile: boolean
  baseUrl = environment.BASE_URL
  constructor(
    private _trustedIndividualsService: TrustedIndividualsService,
    private dialog: MatDialog,
    private _platform: PlatformInfoService
  ) {}

  ngOnInit(): void {
    this.setupTrustedIndividualsObs()
    this._platform.get().subscribe((platform) => {
      this.isMobile = platform.columns4 || platform.columns8
    })
  }

  private setupTrustedIndividualsObs() {
    this.$usersThatThrustYou =
      this._trustedIndividualsService.getTrustedIndividuals()
  }
}
