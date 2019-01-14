import { Component, OnInit } from '@angular/core'
import { PlatformInfoService } from 'src/app/core'

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  tabletOrHandset

  constructor(_platformInfo: PlatformInfoService) {
    _platformInfo.getPlatformInfo().subscribe(platformInfo => {
      this.tabletOrHandset = platformInfo.tabletOrHandset
    })
  }

  ngOnInit() {}
}
