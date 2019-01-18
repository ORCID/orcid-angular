import { Component, HostBinding, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { PlatformInfoService, ProfileService } from 'src/app/core'
import { AffiliationUIGroup, Person, PlatformInfo } from 'src/app/types'
import { environment } from 'src/environments/environment.prod'

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss'],
})
export class ProfilePageComponent implements OnInit {
  @HostBinding('class.mdc-layout-grid__inner') grid = true
  id
  profileAffiliationUiGroups: AffiliationUIGroup[]
  profileGeneralData: Person
  platformInfo: PlatformInfo

  constructor(
    _profileService: ProfileService,
    _activeRoute: ActivatedRoute,
    _platformInfo: PlatformInfoService
  ) {
    _activeRoute.parent.url.subscribe(route => {
      this.id = route[0].path
      _profileService.getAffiliations(this.id).subscribe(data => {
        this.profileAffiliationUiGroups = data
      })
      _profileService.getPerson(this.id).subscribe(
        data => {
          this.profileGeneralData = data
          // Changes publicGroupedAddresses keys for full country names
          if (this.profileGeneralData.publicGroupedAddresses) {
            Object.keys(this.profileGeneralData.publicGroupedAddresses).map(
              key => {
                if (
                  this.profileGeneralData.countryNames &&
                  this.profileGeneralData.countryNames[key]
                ) {
                  this.profileGeneralData.publicGroupedAddresses[
                    this.profileGeneralData.countryNames[key]
                  ] = this.profileGeneralData.publicGroupedAddresses[key]
                  delete this.profileGeneralData.publicGroupedAddresses[key]
                }
              }
            )
          }
        },
        error => {
          // Redirects user when orcid is not found
          if (error.status === 500) {
            window.location.href = environment.BASE_URL + '404'
          }
        }
      )
      _platformInfo.getPlatformInfo().subscribe(platformInfo => {
        this.platformInfo = platformInfo
      })
    })
  }

  profileHasBio(profileGeneralData): boolean {
    return (
      profileGeneralData &&
      profileGeneralData.biography &&
      profileGeneralData.biography.content
    )
  }

  profileHasRecords(profileAffiliationUiGroups, id): boolean {
    return (
      profileAffiliationUiGroups &&
      profileAffiliationUiGroups.filter(
        element => element.affiliationGroup.length
      ).length &&
      id
    )
  }

  ngOnInit() {}
}
