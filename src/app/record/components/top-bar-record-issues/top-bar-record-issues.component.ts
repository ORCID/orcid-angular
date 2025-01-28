import { Component, Input, OnDestroy, OnInit } from '@angular/core'
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'
import { RecordService } from 'src/app/core/record/record.service'
import { UserInfo } from 'src/app/types'


@Component({
  selector: 'app-top-bar-record-issues',
  templateUrl: './top-bar-record-issues.component.html',
  styleUrls: ['./top-bar-record-issues.component.scss'],
  preserveWhitespaces: true,
})
export class TopBarRecordIssuesComponent implements OnInit, OnDestroy {
  @Input() isPublicRecord: string
  $destroy: Subject<boolean> = new Subject<boolean>()
  userInfo: UserInfo
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
      })
  }
  ngOnDestroy() {
    this.$destroy.next(true)
    this.$destroy.unsubscribe()
  }
}
