import { Component, HostBinding, Input, OnInit } from '@angular/core'
import { heightAnimation, rotateAnimation } from 'src/app/animations'
import { PlatformInfoService } from 'src/app/core'

@Component({
  selector: 'app-profile-general-data-detail',
  templateUrl: './profile-general-data-detail.component.html',
  styleUrls: ['./profile-general-data-detail.component.scss'],
  animations: [rotateAnimation, heightAnimation],
})
export class ProfileGeneralDataDetailComponent implements OnInit {
  @Input() title
  @Input() columnDirection = false
  handset
  state = 'close'
  _list

  @HostBinding('class.hide') hide = true
  toggle(btn) {
    this.state = this.state === 'close' ? 'open' : 'close'
  }

  constructor(_platformInfo: PlatformInfoService) {
    _platformInfo.getPlatformInfo().subscribe(platformInfo => {
      this.handset = platformInfo.handset
    })
  }

  ngOnInit() {}

  get list() {
    return this._list
  }

  @Input()
  set list(list: string) {
    this._list = list
    if (list) {
      this.hide = Object.keys(this.list).length === 0
    }
  }
}
