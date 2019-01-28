import { Component, OnInit } from '@angular/core'
import { enterAnimation } from 'src/app/animations'
import { PlatformInfoService } from 'src/app/core'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [enterAnimation],
})
export class HomeComponent implements OnInit {
  tabletOrHandset

  constructor(_platformInfo: PlatformInfoService) {
    _platformInfo.getPlatformInfo().subscribe(platformInfo => {
      this.tabletOrHandset = platformInfo.tabletOrHandset
    })
  }

  ngOnInit() {}
}
