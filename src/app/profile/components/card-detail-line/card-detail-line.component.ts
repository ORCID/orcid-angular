import {
  Component,
  ElementRef,
  HostBinding,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core'

@Component({
  selector: 'app-card-detail-line',
  templateUrl: './card-detail-line.component.html',
  styleUrls: [
    './card-detail-line.component.scss-theme.scss',
    './card-detail-line.component.scss',
  ],
})
export class CardDetailLineComponent implements OnInit {
  @Input() url
  @Input() title
  @Input() detail
  @Input() copyOnClick = false
  @Input() titleMargin = true
  @Input() prefixTitle
  @Input()
  set marginBotton(value) {
    this._marginBotton = value
  }
  get marginBotton() {
    return this._marginBotton
  }
  _content
  @Input()
  set content(value) {
    this._content = value
  }
  get content() {
    return this._content
  }
  @Input()
  set secondaryText(value) {
    this._secondaryText = value
    this._primaryText = !value
  }
  get secondaryText() {
    return this._secondaryText
  }

  @HostBinding('class.margin-botton') _marginBotton = true
  @HostBinding('class.secondary-text') _secondaryText = false
  @HostBinding('class.primary-text') _primaryText = true
  @ViewChild('contentLabel', { static: false }) contentLabel: ElementRef

  constructor() {}

  ngOnInit() {}
}
