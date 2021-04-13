import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { PlatformInfo, PlatformInfoService } from 'src/app/cdk/platform-info'

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
    if (route.snapshot.params.publicOrcidId) {
      this.publicOrcid = route.snapshot.params.publicOrcidId
    }
  }

  ngOnInit(): void {
    this._platform.get().subscribe((value) => (this.platform = value))
  }
}
