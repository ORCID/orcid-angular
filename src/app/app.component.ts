import { Component, HostBinding } from '@angular/core'

import { PlatformInfoService } from './core/platform-info/platform-info.service'
import { GRID_MARGINS } from './constants'
import { PlatformInfo } from './types'

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
  @HostBinding('style.margin') grid_margin

  constructor(_platformInfo: PlatformInfoService) {
    _platformInfo.get().subscribe(platformInfo => {
      this.setPlatformClasses(platformInfo)
      this.setGridMargin(platformInfo)
    })
  }

  setPlatformClasses(platformInfo: PlatformInfo) {
    this.ie = platformInfo.ie
    this.edge = platformInfo.edge
    this.tabletOrHandset = platformInfo.tabletOrHandset
    this.handset = platformInfo.handset
    this.tablet = platformInfo.tablet
    this.desktop = platformInfo.desktop
  }

  setGridMargin(platformInfo: PlatformInfo) {
    if (platformInfo.desktop) {
      this.grid_margin = '0 ' + GRID_MARGINS.desktop + 'px'
    }
    if (platformInfo.tablet) {
      this.grid_margin = '0 ' + GRID_MARGINS.tablet + 'px'
    }
    if (platformInfo.handset) {
      this.grid_margin = '0 ' + GRID_MARGINS.handset + 'px'
    }
  }
}
