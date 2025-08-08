import { Component, Input, OnInit } from '@angular/core'
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'
import { RecordService } from 'src/app/core/record/record.service'
import { RecordUtil as RecordUtil } from 'src/app/shared/utils/record.util'
import { UserInfo } from 'src/app/types'

@Component({
    selector: 'app-record-info',
    templateUrl: './record-info.component.html',
    styleUrls: ['./record-info.component.scss'],
    standalone: false
})
export class RecordInfoComponent implements OnInit {
  $destroy: Subject<boolean> = new Subject<boolean>()

  @Input() isPublicRecord: string
  @Input() affiliations: number
  @Input() displaySideBar: boolean
  @Input() displayBiography: boolean

  userInfo: UserInfo
  isNamePublic: boolean
  baseUrl = runtimeEnvironment.BASE_URL

  constructor(private _record: RecordService) {}

  ngOnInit(): void {
    this._record
      .getRecord({
        publicRecordId: this.isPublicRecord || undefined,
      })
      .pipe(takeUntil(this.$destroy))
      .subscribe((userRecord) => {
        this.userInfo = userRecord?.userInfo
        this.isNamePublic = RecordUtil.isNamePublicAndAffiliations(
          userRecord,
          this.affiliations
        )
      })
  }
}
