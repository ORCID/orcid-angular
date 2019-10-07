import { AnimationEvent } from '@angular/animations'
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core'
import { heightAnimation } from 'src/app/animations'

@Component({
  selector: 'app-card-detail',
  templateUrl: './card-detail.component.html',
  styleUrls: [
    './card-detail.component.scss-theme.scss',
    './card-detail.component.scss',
  ],
  animations: [heightAnimation],
})
export class CardDetailComponent implements OnInit {
  @Input() detailShowLoader
  @Input() createdDate
  @Input() lastModified
  @Input() detailShowOffline
  @Input() detailShowData
  _state
  @Input()
  set state(value) {
    this._state = value
    this.stateChange.emit(value)
  }
  get state() {
    return this._state
  }
  @Output()
  stateChange = new EventEmitter()

  @ViewChild('contentProjection', { static: true })
  contentProjection: ElementRef

  constructor() {}

  ngOnInit() {}

  // TODO an angular material alternative to check for content projection might be try
  // More info on https://github.com/angular/angular/issues/26083#issuecomment-459605457

  hasContentProjection() {
    const detailContentProjection: NodeList = (this.contentProjection
      .nativeElement as HTMLElement).childNodes
    for (let x = 0; x < detailContentProjection.length; x++) {
      if (detailContentProjection.item(x).nodeType !== 8) {
        return true
      }
    }
  }

  onAnimationEvent(event: AnimationEvent) {
    // This is a quick fix to solve the current Angular animation problem with ngFor animations on reordering actions.
    // https://github.com/angular/angular/issues/18847
    // The problem:
    // When a list display by a ngFor is reordered, the animation state of the repositioned
    // elements are going to change to void, this only happens the first time the element is moved.
    // More person about this problem can be found on src/animations.ts

    if (
      event.triggerName === 'heightAnimationState' &&
      event.toState === 'void' &&
      this.state === 'open'
    ) {
      this.state = 'close'
    }
  }
}
