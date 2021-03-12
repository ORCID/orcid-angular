import { Component, Input, OnInit } from '@angular/core'
import { PlatformInfo, PlatformInfoService } from 'src/app/cdk/platform-info'
import { NameForm, RequestInfoForm, UserInfo } from '../../../types'
import { UserRecord } from '../../../types/record.local'
import { UserService } from '../../../core'
import { RecordService } from '../../../core/record/record.service'
import { takeUntil } from 'rxjs/operators'
import { Subject } from 'rxjs'

@Component({
  selector: 'app-my-orcid',
  templateUrl: './my-orcid.component.html',
  styleUrls: ['./my-orcid.component.scss'],
})
export class MyOrcidComponent implements OnInit {
  platform: PlatformInfo

  constructor(private _platform: PlatformInfoService) {}

  ngOnInit(): void {
    this._platform.get().subscribe((value) => (this.platform = value))
  }
}
