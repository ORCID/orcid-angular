import { Injectable, Inject } from '@angular/core'
import { WINDOW } from 'src/app/cdk/window'
import { ScreenDirection, ZendeskWidget } from 'src/app/types'

@Injectable({
  providedIn: 'root',
})
export class ZendeskService {
  zE: ZendeskWidget

  constructor(@Inject(WINDOW) window: Window) {
    this.zE = (<any>window).zE
  }

  hide() {
    this.zE('webWidget', 'hide')
  }

  show() {
    this.zE('webWidget', 'show')
  }

  setScreenDirection(screenDirection: ScreenDirection) {
    if (screenDirection === 'rtl') {
      this.zE('webWidget', 'updateSettings', {
        webWidget: {
          position: { horizontal: 'left', vertical: 'bottom' },
        },
      })
    }
  }
}
