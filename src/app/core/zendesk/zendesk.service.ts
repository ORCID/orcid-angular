import { Injectable, Inject, NgZone } from '@angular/core'
import { WINDOW } from 'src/app/cdk/window'
import { ScreenDirection, ZendeskWidget } from 'src/app/types'
import { PlatformInfo } from 'src/app/cdk/platform-info'

@Injectable({
  providedIn: 'root',
})
export class ZendeskService {
  zE: ZendeskWidget

  constructor(@Inject(WINDOW) private _window: Window, private _zone: NgZone) {}

  hide() {
    this.zE = (<any>this._window).zE
    this.zE('webWidget', 'hide')
  }

  show() {
    this.zE = (<any>this._window).zE
    this.zE('webWidget', 'show')
  }

  adaptPluginToPlatform(platform: PlatformInfo) {
    if (platform.screenDirection === 'rtl') {
      this.zE('webWidget', 'updateSettings', {
        webWidget: {
          position: { horizontal: 'left', vertical: 'bottom' },
        },
      })
    }
    console.log(platform.oauthMode)
    if (platform.oauthMode) {
      this.hide()
    } else if (!platform.oauthMode) {
      this.show()
    }
  }
}
