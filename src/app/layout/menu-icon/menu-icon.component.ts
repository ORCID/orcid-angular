import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'

@Component({
  selector: 'app-menu-icon',
  templateUrl: './menu-icon.component.html',
  styleUrls: [
    './menu-icon.component.scss',
    './menu-icon.component.scss-theme.scss',
  ],
})
export class MenuIconComponent implements OnInit {
  isOpenValue = false

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
