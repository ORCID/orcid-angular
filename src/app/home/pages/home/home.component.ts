import { Component, OnInit, Inject } from '@angular/core'
import { enterAnimation } from 'src/app/animations'
import { WINDOW, PlatformInfoService } from 'src/app/core'
import { BrowserWindowRef } from 'src/app/core/window/window.service'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [enterAnimation],
  preserveWhitespaces: true,
})
export class HomeComponent implements OnInit {
  platform

  constructor(
    _platformInfo: PlatformInfoService,
    @Inject(WINDOW) private window: Window
  ) {
    _platformInfo.get().subscribe(platformInfo => {
      this.platform = platformInfo
    })
  }

  navigateTo(val) {
    this.window.location.href = val
  }

  ngOnInit() {}
}
