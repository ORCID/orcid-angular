import { Component, Inject, OnInit } from '@angular/core'
import { WINDOW } from 'src/app/cdk/window'

@Component({
  selector: 'app-settings-sharing',
  templateUrl: './settings-sharing.component.html',
  styleUrls: ['./settings-sharing.component.scss'],
  standalone: false,
})
export class SettingsSharingComponent implements OnInit {
  titleHtmlCode = $localize`:@@account.htmlCode:Display your ORCID iD on the web`
  titleQrCode = $localize`:@@account.qrCode:Get a QR code for your ORCID iD`

  htmlCode = false
  qrCode = false

  htmlCodeLoading = false
  qrCodeLoading = false
  constructor(@Inject(WINDOW) private _window: Window) {}

  ngOnInit(): void {
    const hash = this._window.location.hash.substr(1)
    switch (hash) {
      case 'qr-code':
        this.qrCode = true
        break
      case 'share':
        this.htmlCode = true
        break
    }
  }
}
