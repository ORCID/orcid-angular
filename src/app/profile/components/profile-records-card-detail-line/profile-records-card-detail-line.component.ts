import { Component, OnInit, Inject, ElementRef, ViewChild } from '@angular/core'
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
  _content
  @Input()
  set content(value) {
    this._content = value
    console.log(value)
  }
  get content() {
    return this._content
  }

  @ViewChild('contentLabel') contentLabel: ElementRef

  constructor() {}

  ngOnInit() {}
}
