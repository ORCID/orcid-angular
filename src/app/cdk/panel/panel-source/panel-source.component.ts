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
  _stackMode
  _displayAsMainStackCard
  @Input()
  set stackMode(value: boolean) {
    this._stackMode = value
    this.stackModeChange.emit(value)
  }
  get stackMode(): boolean {
    return this._stackMode
  }
  @Output() stackModeChange = new EventEmitter<boolean>()
  isHanset: boolean

  @Output() makePrimary = new EventEmitter<void>()
  @Input() displayAsMainStackCard: boolean

  @Output() displayAsMainStackCardChange = new EventEmitter<void>()

  constructor(private _platformInfo: PlatformInfoService) {
    this._platformInfo.get().subscribe((person) => {
      this.isHanset = person.handset
    })
  }
  ngOnInit(): void {}

  toggleStackMode() {
    if (this.stackLength > 1) {
      this.stackMode = !this.stackMode
    }
  }

  clickMakePrimary() {
    this.makePrimary.next()
  }

  clickDisplayAsMainStackCard() {
    console.log('EMIT')

    this.displayAsMainStackCardChange.next()
  }
}
