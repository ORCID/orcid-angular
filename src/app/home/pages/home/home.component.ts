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
  platform

  constructor(_platformInfo: PlatformInfoService) {
    _platformInfo.get().subscribe(platformInfo => {
      this.platform = platformInfo
    })
  }

  ngOnInit() {}
}
