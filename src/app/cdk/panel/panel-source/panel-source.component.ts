import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { PlatformInfoService } from '../../platform-info'

@Component({
  selector: 'app-panel-source',
  templateUrl: './panel-source.component.html',
  styleUrls: ['./panel-source.component.scss'],
})
export class PanelSourceComponent implements OnInit {
  @Input() isPreferred = true
  @Input() sourceName
  _stackMode
  @Input() stackLength
  @Input() stackState = 'open'
  @Input()
  set stackMode(value) {
    this._stackMode = value
    this.stackModeChange.emit(value)
  }
  get stackMode() {
    return this._stackMode
  }
  @Output() stackModeChange = new EventEmitter()
  isHanset: boolean

  constructor(private _platformInfo: PlatformInfoService) {
    this._platformInfo.get().subscribe((person) => {
      this.isHanset = person.handset
    })
  }
  ngOnInit(): void {}
  toggleStack() {
    this.stackState = this.stackState === 'open' ? 'close' : 'open'
  }
  toggleStackMode() {
    if (this.stackLength > 1) {
      this.stackMode = !this.stackMode
    }
  }
}
