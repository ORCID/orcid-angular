import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import {
  heightAnimation,
  heightAnimationDefaultOpen,
  rotateAnimation,
} from 'src/app/animations'
import { PlatformInfoService } from 'src/app/cdk/platform-info'

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss-theme.scss', './card.component.scss'],
  animations: [rotateAnimation, heightAnimation, heightAnimationDefaultOpen],
})
export class CardComponent implements OnInit {
  @Input() startDate
  @Input() date
  @Input() endDate
  @Input() sourceName
  @Input() role
  @Input() type
  @Input() department
  @Input() stackState = 'open'
  @Input() state = 'close'
  @Input() isPreferred = true
  @Input() stackLength
  @Output() toggleDetails = new EventEmitter()
  _stackMode
  @Input()
  set stackMode(value) {
    this._stackMode = value
    this.stackModeChange.emit(value)
  }
  get stackMode() {
    return this._stackMode
  }
  @Output() stackModeChange = new EventEmitter()

  isHanset

  constructor(private _platformInfo: PlatformInfoService) {
    this._platformInfo.get().subscribe((person) => {
      this.isHanset = person.handset
    })
  }

  ngOnInit() {}

  toggleStack() {
    this.stackState = this.stackState === 'open' ? 'close' : 'open'
  }

  toggleStackMode() {
    if (this.stackLength > 1) {
      this.stackMode = !this.stackMode
    }
  }
}
