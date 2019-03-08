import { Component, HostBinding } from '@angular/core'

import { PlatformInfoService } from './core/platform-info/platform-info.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  @HostBinding('class.edge') edge
  @HostBinding('class.ie') ie
  @HostBinding('class.tabletOrHandset') tabletOrHandset
  @HostBinding('class.handset') handset
  @HostBinding('class.tablet') tablet
  @HostBinding('class.desktop') desktop

  bootstrapLayout = true

  constructor(_platformInfo: PlatformInfoService) {
    _platformInfo.get().subscribe(platformInfo => {
      this.ie = platformInfo.ie
      this.edge = platformInfo.edge
      this.tabletOrHandset = platformInfo.tabletOrHandset
      this.handset = platformInfo.handset
      this.tablet = platformInfo.tablet
      this.desktop = platformInfo.desktop
    })
  }
}
