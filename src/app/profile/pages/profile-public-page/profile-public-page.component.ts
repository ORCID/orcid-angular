import { Component, HostBinding, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { ProfileService } from '../../../core/profile/profile.service'

@Component({
  selector: 'app-profile-public-page',
  templateUrl: './profile-public-page.component.html',
  styleUrls: ['./profile-public-page.component.scss'],
})
export class ProfilePublicPageComponent implements OnInit {
  @HostBinding('class.mdc-layout-grid__inner') grid = true
  affiliations
  person
  constructor(_profileService: ProfileService, _activeRoute: ActivatedRoute) {
    _activeRoute.url.subscribe(x => {
      const id = x[0].path
      _profileService.getAffiliations(id).subscribe(data => {
        this.affiliations = data
      })
      _profileService.getPerson(id).subscribe(data => {
        this.person = data
      })
    })
  }

  ngOnInit() {}
}
