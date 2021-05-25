import { Component, Input, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { PlatformInfoService } from 'src/app/cdk/platform-info'
import { UserService } from 'src/app/core'
import { RecordService } from 'src/app/core/record/record.service'

@Component({
  selector: 'app-top-bar-my-public-record-preview',
  templateUrl: './top-bar-my-public-record-preview.component.html',
  styleUrls: [
    './top-bar-my-public-record-preview.component.scss',
    './top-bar-my-public-record-preview.component.scss-theme.scss',
  ],
})
export class TopBarMyPublicRecordPreviewComponent implements OnInit {
  @Input() isPublicRecord: string
  isMyPublicRecord = false

  constructor(
    _platform: PlatformInfoService,
    private _user: UserService,
    private _record: RecordService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this._user.getUserSession().subscribe((value) => {
      if (value.userInfo) {
        this.isMyPublicRecord =
          value.userInfo.EFFECTIVE_USER_ORCID === this.isPublicRecord
      }
    })
  }
  goToMyRecord() {
    this.router.navigate(['/my-orcid'])
  }
}
