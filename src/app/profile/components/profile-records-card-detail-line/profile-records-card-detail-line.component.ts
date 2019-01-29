import { Component, OnInit } from '@angular/core'
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
  _content
  @Input()
  set content(value) {
    this._content = value
    console.log(value)
  }
  get content() {
    return this._content
  }

  constructor() {}

  ngOnInit() {}
}
