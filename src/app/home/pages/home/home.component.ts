import { Component, OnInit, Input } from '@angular/core'
import { PlatformInfoService } from '../../../core'
import { enterAnimation } from 'src/app/animations'

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
