import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'

@Component({
  selector: 'app-menu-icon',
  templateUrl: './menu-icon.component.html',
  styleUrls: [
    './menu-icon.component.scss',
    './menu-icon.component.scss-theme.scss',
  ],
  standalone: false,
})
export class MenuIconComponent implements OnInit {
  isOpenValue = false
  labelMenu = $localize`:@@layout.ariaLabelMenu:main menu`

  @Input()
  get isOpen() {
    return this.isOpenValue
  }
  set isOpen(value) {
    this.isOpenValue = value
  }
  @Output() isOpenChange = new EventEmitter<string>()

  constructor() {}

  ngOnInit() {}
}
