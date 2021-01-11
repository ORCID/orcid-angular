import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { VisibilityStrings } from 'src/app/types/common.endpoint'

@Component({
  selector: 'app-privacy-selector',
  templateUrl: './privacy-selector.component.html',
  styleUrls: [
    './privacy-selector.component.scss-theme.scss',
    './privacy-selector.component.scss',
  ],
})
export class PrivacySelectorComponent implements OnInit {
  _privacy: VisibilityStrings
  @Input()
  set privacy(value: VisibilityStrings) {
    this._privacy = value
    this.privacyChange.emit(value)
  }
  get privacy(): VisibilityStrings {
    return this._privacy
  }
  @Output()
  privacyChange = new EventEmitter<VisibilityStrings>()

  constructor() {}

  private() {
    this.privacy = 'PRIVATE'
  }
  limited() {
    this.privacy = 'LIMITED'
  }
  public() {
    this.privacy = 'PUBLIC'
  }

  ngOnInit(): void {}
}
