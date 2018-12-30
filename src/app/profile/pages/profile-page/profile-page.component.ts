import { Component, HostBinding, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'

import { ProfileService } from '../../../core/profile/profile.service'
import { Person } from '../../../types'

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss'],
})
export class ProfilePageComponent implements OnInit {
  @HostBinding('class.mdc-layout-grid__inner') grid = true
  id
  affiliations
  profileGeneralData: Person
  constructor(_profileService: ProfileService, _activeRoute: ActivatedRoute) {
    _activeRoute.parent.url.subscribe(x => {
      console.log(x)
      this.id = x[0].path
      _profileService.getAffiliations(this.id).subscribe(data => {
        this.affiliations = data
      })
      _profileService.getPerson(this.id).subscribe(data => {
        this.profileGeneralData = data
        console.log(this.profileGeneralData)
      })
    })
  }

  ngOnInit() {}
}
