import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ChangeDetectionStrategy,
} from '@angular/core'

@Component({
  selector: 'app-client-secret',
  templateUrl: './client-secret.component.html',
  styleUrls: [
    './client-secret.component.scss',
    './client-secret.component.scss-theme.scss',
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class ClientSecretComponent implements OnInit {
  @Input() clientId: string
  @Input() clientSecret: string
  @Output() clientSecretUpdated = new EventEmitter<string>()

  constructor() {}

  ngOnInit(): void {}
}
