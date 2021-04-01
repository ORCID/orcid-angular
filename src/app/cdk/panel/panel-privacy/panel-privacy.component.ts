import { Component, HostBinding, Input, OnInit } from '@angular/core'
import { VisibilityStrings } from 'src/app/types/common.endpoint'

@Component({
  selector: 'app-panel-privacy',
  templateUrl: './panel-privacy.component.html',
  styleUrls: [
    './panel-privacy.component.scss',
    './panel-privacy.component.scss-theme.scss',
  ],
})
export class PanelPrivacyComponent implements OnInit {
  @HostBinding('attr.aria-label') label = ''
  _visibility: VisibilityStrings

  @Input() set visibility(visibility: VisibilityStrings) {
    this.label = visibility
    this._visibility = visibility
  }
  get visibility() {
    return this._visibility
  }
  constructor() {}

  ngOnInit(): void {}
}
