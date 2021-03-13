import { Component, OnInit } from '@angular/core'
import { PlatformInfo, PlatformInfoService } from 'src/app/cdk/platform-info'

@Component({
  selector: 'app-my-orcid',
  templateUrl: './my-orcid.component.html',
  styleUrls: ['./my-orcid.component.scss'],
})
export class MyOrcidComponent implements OnInit {
  platform: PlatformInfo

  constructor(private _platform: PlatformInfoService) {}

  ngOnInit(): void {
    this._platform.get().subscribe((value) => (this.platform = value))
  }
}
