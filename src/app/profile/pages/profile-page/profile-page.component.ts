import { Component, HostBinding, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'

import { PlatformInfoService, ProfileService } from 'src/app/core'
import { Person, PlatformInfo } from 'src/app/types'
import { Affiliations } from '../../../types'

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss'],
})
export class ProfilePageComponent implements OnInit {
  @HostBinding('class.mdc-layout-grid__inner') grid = true
  id
  profileAffiliationsData: Affiliations
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
        this.profileAffiliationsData = data
      })
      _profileService.getPerson(this.id).subscribe(data => {
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
      })
      _platformInfo.getPlatformInfo().subscribe(platformInfo => {
        this.platformInfo = platformInfo
      })
    })
  }

  ngOnInit() {}
}
