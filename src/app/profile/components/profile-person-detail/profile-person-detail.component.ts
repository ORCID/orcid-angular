import { Component, HostBinding, Input, OnInit } from '@angular/core'
import { heightAnimation, rotateAnimation } from 'src/app/animations'
import { PlatformInfoService } from 'src/app/cdk/platform-info'

@Component({
  selector: 'app-profile-person-detail',
  templateUrl: './profile-person-detail.component.html',
  styleUrls: [
    './profile-person-detail.component.scss-theme.scss',
    './profile-person-detail.component.scss',
  ],
  animations: [rotateAnimation, heightAnimation],
})
export class ProfileInfoDetailComponent implements OnInit {
  @Input() title
  @Input() columnDirection = false
  @Input()
  set list(list: string) {
    this._list = list
    if (list) {
      this.hide = Object.keys(this.list).length === 0
    }
  }
  get list() {
    return this._list
  }

  handset
  state = 'close'
  _list

  @HostBinding('class.hide') hide = true

  toggle(btn) {
    this.state = this.state === 'close' ? 'open' : 'close'
  }

  constructor(_platformInfo: PlatformInfoService) {
    _platformInfo.get().subscribe(platformInfo => {
      this.handset = platformInfo.handset
    })
  }

  ngOnInit() {}
}
