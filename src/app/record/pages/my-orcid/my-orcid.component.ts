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
    this.checkIfThisIsAPublicOrcid()
  }

  private checkIfThisIsAPublicOrcid() {
    if (
      this.route.parent.snapshot.url &&
      // TODO!! SHOULD check for 'url[0]' when the '/qa/' URL path is remove
      ORCID_REGEXP.test(this.route.parent.snapshot.url[1].toString())
    ) {
      return (this.publicOrcid = this.route.parent.snapshot.url[1].toString())
    }
    return undefined
  }

  ngOnInit(): void {
    this._platform.get().subscribe((value) => (this.platform = value))
  }
}
