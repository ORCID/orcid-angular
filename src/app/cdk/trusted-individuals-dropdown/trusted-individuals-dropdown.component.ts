import { Component, OnInit } from '@angular/core'

@Component({
  selector: 'app-trusted-individuals-dropdown',
  templateUrl: './trusted-individuals-dropdown.component.html',
  styleUrls: [
    './trusted-individuals-dropdown.component.scss',
    './trusted-individuals-dropdown.component.scss-theme.scss',
  ],
  preserveWhitespaces: true,
})
export class TrustedIndividualsDropdownComponent implements OnInit {
  hasTrustedIndividual = true
  alternativeAccounts = ['test', 'test2']
  constructor() {}

  ngOnInit(): void {}

  changeAccount() {
    throw new Error('Unimplemented')
  }
}
