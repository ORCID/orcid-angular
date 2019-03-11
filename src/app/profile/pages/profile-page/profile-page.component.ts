import { Component, HostBinding, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { PlatformInfoService, ProfileService } from 'src/app/core'
import { AffiliationUIGroup, Person, PlatformInfo, Works } from 'src/app/types'
import { environment } from 'src/environments/environment.prod'
import { filter } from 'rxjs/operators'

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss'],
})
export class ProfilePageComponent implements OnInit {
  @HostBinding('class.mdc-layout-grid__inner') grid = true

  id
  profileAffiliationUiGroups: AffiliationUIGroup[]
  profileWorks: Works
  profileGeneralData: Person
  platformInfo: PlatformInfo

  constructor(
    _profileService: ProfileService,
    _activeRoute: ActivatedRoute,
    _platformInfo: PlatformInfoService
  ) {
    _activeRoute.parent.url
      .pipe(filter(route => !!route[0]))
      .subscribe(route => {
        this.id = route[0].path
        _profileService.get(this.id).subscribe(
          data => {
            this.profileGeneralData = data[0]
            this.profileAffiliationUiGroups = data[1]
            this.profileWorks = data[2]
          },
          error => {
            // Redirects user when orcid is not found
            if (error.error.status === 500) {
              window.location.href = environment.BASE_URL + '404'
            }
          }
        )

        _platformInfo.get().subscribe(platformInfo => {
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

  profileHasActivities(profileAffiliationUiGroups, id): boolean {
    return (
      // Has at lest one affiliation
      ((profileAffiliationUiGroups &&
        profileAffiliationUiGroups.filter(
          element => element.affiliationGroup.length
        ).length) ||
        // Or has at lest one work
        (this.profileWorks && this.profileWorks.groups.length)) &&
      // And has an ID
      id
    )
  }

  ngOnInit() {}
}
