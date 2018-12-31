import { Component, OnInit, Input, HostBinding } from '@angular/core'
import { trigger, style, transition, state, animate } from '@angular/animations'

@Component({
  selector: 'app-profile-general-data-detail',
  templateUrl: './profile-general-data-detail.component.html',
  styleUrls: ['./profile-general-data-detail.component.scss'],
  animations: [
    trigger('rotatedState', [
      state('close', style({ transform: 'rotate(0)' })),
      state('open', style({ transform: 'rotate(-180deg)' })),
      transition('open => close', animate('200ms ease-out')),
      transition('close => open', animate('200ms ease-in')),
    ]),
  ],
})
export class ProfileGeneralDataDetailComponent implements OnInit {
  @Input() title
  state = 'close'
  _list

  @HostBinding('class.hide') hide = true
  toggle(btn) {
    this.state = this.state === 'close' ? 'open' : 'close'
  }

  constructor() {}

  ngOnInit() {}

  get list() {
    return this._list
  }

  @Input()
  set list(list: string) {
    console.log(list)
    this._list = list
    if (list) {
      this.hide = Object.keys(this.list).length === 0
    }
  }
}
