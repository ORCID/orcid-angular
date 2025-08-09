import {
  Component,
  ElementRef,
  HostBinding,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core'

@Component({
  selector: 'app-panel-data-line',
  templateUrl: './panel-data-line.component.html',
  styleUrls: ['./panel-data-line.component.scss'],
  preserveWhitespaces: true,
  standalone: false,
})
export class PanelDataLineComponent implements OnInit {
  @Input() noBoldTitle = false
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
  @ViewChild('contentLabel') contentLabel: ElementRef

  constructor() {}

  ngOnInit() {}
}
