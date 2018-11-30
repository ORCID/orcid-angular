import { Component, OnInit } from '@angular/core'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  public menu = {
    'FOR RESEARCHERS': [],
    'FOR ORGANIZATIONS': [],
    ABOUT: [],
    HELP: [],
    'SIGN IN': [],
  }
  constructor() {
    console.log(Object.keys(this.menu))
  }

  ngOnInit() {}

  mouseEnter(div: string) {
    console.log('mouse enter : ' + div)
  }

  mouseLeave(div: string) {
    console.log('mouse leave :' + div)
  }
}
