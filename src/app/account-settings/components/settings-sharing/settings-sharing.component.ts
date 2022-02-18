import { Component, OnInit } from '@angular/core'

@Component({
  selector: 'app-settings-sharing',
  templateUrl: './settings-sharing.component.html',
  styleUrls: ['./settings-sharing.component.scss'],
})
export class SettingsSharingComponent implements OnInit {
  titleHtmlCode = $localize`:@@account.htmlCode:Display your ORCID iD on the web`
  titleQrCode = $localize`:@@account.qrCode:Get a QR code for your ORCID iD`

  htmlCode = false
  qrCode = false

  htmlCodeLoading = false
  qrCodeLoading = false
  constructor() {}

  ngOnInit(): void {}
}
