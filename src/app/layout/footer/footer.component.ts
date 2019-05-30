import { Component, OnInit, Inject } from '@angular/core'
import { PlatformInfoService, WINDOW } from 'src/app/core'

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  tabletOrHandset

  constructor(
    _platformInfo: PlatformInfoService,
    @Inject(WINDOW) private window: Window
  ) {
    _platformInfo.get().subscribe(platformInfo => {
      this.tabletOrHandset = platformInfo.tabletOrHandset
    })
  }

  ngOnInit() {}

  goTo(url) {
    this.window.location.href = url
  }
}
