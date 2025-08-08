import { ViewportScroller } from '@angular/common'
import { AfterViewInit, Component, Inject, OnInit } from '@angular/core'
import { WINDOW } from 'src/app/cdk/window'

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss'],
    standalone: false
})
export class SettingsComponent implements AfterViewInit {
  constructor(
    private viewportScroller: ViewportScroller,
    @Inject(WINDOW) private _window: Window
  ) {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      if (this._window.location.hash.length > 1) {
        const hash = this._window.location.hash.substr(1)
        this.viewportScroller.scrollToAnchor('cy-' + hash + '-panel')
      }
    }, 1000)
  }
}
