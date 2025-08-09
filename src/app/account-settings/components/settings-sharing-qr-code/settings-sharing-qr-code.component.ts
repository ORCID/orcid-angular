import { Component, EventEmitter, OnInit, Output } from '@angular/core'

@Component({
  selector: 'app-settings-sharing-qr-code',
  templateUrl: './settings-sharing-qr-code.component.html',
  styleUrls: ['./settings-sharing-qr-code.component.scss'],
  standalone: false,
})
export class SettingsSharingQrCodeComponent implements OnInit {
  @Output() loading = new EventEmitter<boolean>()

  constructor() {}

  ngOnInit(): void {}
}
