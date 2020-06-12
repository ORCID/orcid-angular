import { Component, OnInit, Inject } from '@angular/core'
import { WINDOW } from 'src/app/cdk/window'

@Component({
  selector: 'app-authorize',
  templateUrl: './authorize.component.html',
  styleUrls: ['./authorize.component.scss'],
  preserveWhitespaces: true,
})
export class AuthorizeComponent implements OnInit {
  isATrustedIndividual = true
  alternativeAccounts = ['test', 'test2']
  constructor(@Inject(WINDOW) private window: Window) {}

  ngOnInit(): void {}

  navigateTo(val) {
    this.window.location.href = val
  }

  changeAccount() {
    throw new Error('Unimplemented')
  }

  signout() {}
}
