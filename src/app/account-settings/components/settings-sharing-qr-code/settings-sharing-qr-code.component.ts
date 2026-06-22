import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ChangeDetectionStrategy,
} from '@angular/core'

@Component({
  selector: 'app-settings-sharing-qr-code',
  templateUrl: './settings-sharing-qr-code.component.html',
  styleUrls: ['./settings-sharing-qr-code.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class SettingsSharingQrCodeComponent implements OnInit {
  @Output() loading = new EventEmitter<boolean>()

  constructor() {}

  ngOnInit(): void {}
}
