import {
  Component,
  Input,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core'

@Component({
  selector: 'app-offline-message',
  templateUrl: './offline-message.component.html',
  styleUrls: [
    './offline-message.component.scss-theme.scss',
    './offline-message.component.scss',
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class OfflineMessageComponent implements OnInit {
  @Input() canBeRetry
  constructor() {}

  ngOnInit() {}
}
