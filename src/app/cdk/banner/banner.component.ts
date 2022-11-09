import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core'

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss'],
})
export class BannerComponent implements OnInit {
  @Input() dismissCookie = 'cookieName'
  @Input() canDismiss = false
  @Input() dismissCookieTime = 365
  @Output() dismiss = new EventEmitter()
  @Input() ariaLabel

  constructor() {}

  ngOnInit() {}

  onDismiss() {
    // this._cookie.set(
    //   this.dismissCookie,
    //   'dont show message',
    //   this.dismissCookieTime
    // )
    this.dismiss.emit()
  }
}
