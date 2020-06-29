import { Component, OnInit, HostBinding } from '@angular/core'

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: [
    './notification.component.scss',
    './notification.component.scss-theme.scss',
  ],
})
export class NotificationComponent implements OnInit {
  @HostBinding('class.archived') archived = false

  constructor() {}

  ngOnInit(): void {}
}
