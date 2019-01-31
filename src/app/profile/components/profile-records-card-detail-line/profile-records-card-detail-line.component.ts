import {
  Component,
  OnInit,
  Inject,
  ElementRef,
  ViewChild,
  HostBinding,
} from '@angular/core'
import { Input } from '@angular/core'

@Component({
  selector: 'app-profile-records-card-detail-line',
  templateUrl: './profile-records-card-detail-line.component.html',
  styleUrls: ['./profile-records-card-detail-line.component.scss'],
})
export class ProfileRecordsCardDetailLineComponent implements OnInit {
  @Input() url
  @Input() title
  @Input() detail
  @Input() copyOnClick = false
  @Input() titleMargin = true
  @Input() secondaryText = false
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
    console.log(value)
  }
  get content() {
    return this._content
  }

  @HostBinding('class.margin-botton') _marginBotton = true

  @ViewChild('contentLabel') contentLabel: ElementRef

  constructor() {}

  ngOnInit() {}
}
