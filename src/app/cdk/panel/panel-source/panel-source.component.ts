import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { PlatformInfoService } from '../../platform-info'

@Component({
  selector: 'app-panel-source',
  templateUrl: './panel-source.component.html',
  styleUrls: ['./panel-source.component.scss'],
  preserveWhitespaces: true,
})
export class PanelSourceComponent implements OnInit {
  @Input() isPreferred = true
  @Input() sourceName
  @Input() stackLength
  _displayTheStack
  _displayAsMainStackCard
  @Input()
  set displayTheStack(value: boolean) {
    this._displayTheStack = value
    this.displayTheStackChange.emit(value)
  }
  get displayTheStack(): boolean {
    return this._displayTheStack
  }
  @Output() displayTheStackChange = new EventEmitter<boolean>()
  isHanset: boolean

  @Output() makePrimary = new EventEmitter<void>()
  @Input() topPanelOfTheStackMode: boolean
  @Input() clickableSource = true
  @Output() topPanelOfTheStackModeChange = new EventEmitter<void>()

  constructor(private _platformInfo: PlatformInfoService) {
    this._platformInfo.get().subscribe((person) => {
      this.isHanset = person.handset
    })
  }
  ngOnInit(): void {}

  toggleStackMode() {
    if (this.stackLength > 1) {
      this.displayTheStack = !this.displayTheStack
    }
  }

  clickMakePrimary() {
    this.makePrimary.next()
  }

  clickDisplayAsTopPanelOfTheStack() {
    this.topPanelOfTheStackModeChange.next()
  }
}
