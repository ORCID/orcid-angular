import { Component, HostBinding, Input, OnInit } from '@angular/core'
import { VisibilityStrings } from 'src/app/types/common.endpoint'

@Component({
  selector: 'app-panel-privacy',
  templateUrl: './panel-privacy.component.html',
  styleUrls: [
    './panel-privacy.component.scss',
    './panel-privacy.component.scss-theme.scss',
  ],
  standalone: false,
})
export class PanelPrivacyComponent implements OnInit {
  @HostBinding('attr.aria-label') label = ''
  _visibility: VisibilityStrings
  ariaLabelVisibility = $localize`:@@share.visibilityCurrentlySetTo:visibility is currently set to`

  @Input() set visibility(visibility: VisibilityStrings) {
    switch (visibility) {
      case 'PUBLIC':
        this.label =
          this.ariaLabelVisibility +
          ' ' +
          $localize`:@@register.VisibilityEveryone:Everyone`

        break
      case 'PRIVATE':
        this.label =
          this.ariaLabelVisibility + ' ' + $localize`:@@shared.onlyMe:Only me`

        break
      case 'LIMITED':
        this.label =
          this.ariaLabelVisibility + ' ' + $localize`:@@account.trusted:Trusted`

        break

      default:
        break
    }

    this._visibility = visibility
  }
  get visibility() {
    return this._visibility
  }
  constructor() {}

  ngOnInit(): void {}
}
