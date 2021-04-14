import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { PlatformInfo, PlatformInfoService } from 'src/app/cdk/platform-info'
import { ORCID_REGEXP } from 'src/app/constants'

@Component({
  selector: 'app-my-orcid',
  templateUrl: './my-orcid.component.html',
  styleUrls: ['./my-orcid.component.scss'],
})
export class MyOrcidComponent implements OnInit {
  platform: PlatformInfo
  publicOrcid: string

  constructor(
    private _platform: PlatformInfoService,
    private route: ActivatedRoute
  ) {
    if (
      route.parent.snapshot.url &&
      ORCID_REGEXP.test(route.parent.snapshot.url[1].toString())
    ) {
      this.publicOrcid = route.parent.snapshot.url[1].toString() // TODO!! SHOULD BE [0] when the QA sub url is remove
    }
  }

  ngOnInit(): void {
    this._platform.get().subscribe((value) => (this.platform = value))
  }
}
