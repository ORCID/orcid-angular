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
  @HostBinding('class.green') green = false
  @HostBinding('class.orange') orange = true
  @HostBinding('class.blue') blue = false

  constructor() {}

  ngOnInit(): void {}
}
