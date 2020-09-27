import { Injectable, Inject } from '@angular/core'
import { WINDOW } from 'src/app/cdk/window'
import { ZendeskWidget } from 'src/app/types'
import { PlatformInfo } from 'src/app/cdk/platform-info'

@Injectable({
  providedIn: 'root',
})
export class ZendeskService {
  zE: ZendeskWidget

  constructor(@Inject(WINDOW) private _window: Window) {}

  hide() {
    this.zE = (this._window as any).zE
    this.zE('webWidget', 'hide')
  }

  show() {
    this.zE = (this._window as any).zE
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
  }
}
