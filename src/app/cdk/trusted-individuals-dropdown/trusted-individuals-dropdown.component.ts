import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'
import {
  Delegator,
  TrustedIndividuals,
} from 'src/app/types/trusted-individuals.endpoint'

@Component({
    selector: 'app-trusted-individuals-dropdown',
    templateUrl: './trusted-individuals-dropdown.component.html',
    styleUrls: [
        './trusted-individuals-dropdown.component.scss',
        './trusted-individuals-dropdown.component.scss-theme.scss',
    ],
    preserveWhitespaces: true,
    standalone: false
})
export class TrustedIndividualsDropdownComponent implements OnInit {
  _trustedIndividuals: TrustedIndividuals
  delegators: Delegator[]
  switchToMeAccount: Delegator
  labelSwitchAccount = $localize`:@@delegators.ariaLabelswitchAccount:Switch to managing another ORCID account`

  @Input()
  set trustedIndividuals(value: TrustedIndividuals) {
    this.delegators = value.delegators
    this.switchToMeAccount = value.me
    this._trustedIndividuals = value
  }
  get trustedIndividuals() {
    return this._trustedIndividuals
  }
  @Output() changeUser = new EventEmitter<Delegator>()
  ngOnInit(): void {}

  changeAccount(delegator: Delegator) {
    this.changeUser.next(delegator)
  }
}
