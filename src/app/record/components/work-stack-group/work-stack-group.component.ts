import { Component, Input, OnInit } from '@angular/core'
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'
import { UserService } from 'src/app/core'
import { RecordService } from 'src/app/core/record/record.service'
import { WorkGroup, WorksEndpoint } from 'src/app/types/record-works.endpoint'
import { UserRecord } from 'src/app/types/record.local'
import { UserSession } from 'src/app/types/session.local'

@Component({
  selector: 'app-work-stack-group',
  templateUrl: './work-stack-group.component.html',
  styleUrls: ['./work-stack-group.component.scss'],
})
export class WorkStackGroupComponent implements OnInit {
  @Input() isPublicRecord: string

  $destroy: Subject<boolean> = new Subject<boolean>()

  workGroup: WorksEndpoint
  userSession: UserSession
  userRecord: UserRecord

  works = $localize`:@@shared.works:Works`

  constructor(
    private _userSession: UserService,
    private _record: RecordService
  ) {}

  ngOnInit(): void {
    console.log('I AM ON THE WORKS')

    this._record
      .getRecord({ publicRecordId: this.isPublicRecord })
      .subscribe((userRecord) => {
        console.log('I AM ON WORKS GETTING THE RECORD')

        this.userRecord = userRecord
        this.workGroup = this.userRecord.works
      })

    this._userSession
      .getUserSession()
      .pipe(takeUntil(this.$destroy))
      .subscribe((userSession) => {
        console.log('I AM ON WORKS GETTING THE SESSION')

        this.userSession = userSession
      })
  }

  trackByWorkGroup(index, item: WorkGroup) {
    return item.defaultPutCode
  }
}
