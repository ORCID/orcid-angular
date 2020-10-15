import { Component, Inject, OnInit } from '@angular/core'
import { WINDOW } from '../../../cdk/window'
import { environment } from '../../../../environments/environment.local'

@Component({
  selector: 'app-notification-footer',
  templateUrl: './notification-footer.component.html',
  styleUrls: ['./notification-footer.component.scss'],
  preserveWhitespaces: true
})
export class NotificationFooterComponent implements OnInit {
  baseUri: string

  constructor(
    @Inject(WINDOW) private window: Window
  ) {
    this.baseUri = environment.BASE_URL
  }

  ngOnInit(): void {
  }

  navigateTo(val) {
    this.window.location.href = val
  }

}
