import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { Observable, Subject } from 'rxjs'
import { first, take, takeUntil } from 'rxjs/operators'
import { UserService } from 'src/app/core'
import { RecordCountriesService } from 'src/app/core/record-countries/record-countries.service'
import { RecordService } from 'src/app/core/record/record.service'
import { FundingGroup } from 'src/app/types/record-funding.endpoint'
import {
  MainPanelsState,
  UserRecord,
  UserRecordOptions,
} from 'src/app/types/record.local'
import { UserSession } from 'src/app/types/session.local'
import { SortData, SortOrderType } from 'src/app/types/sort'

import { RecordFundingsService } from '../../../core/record-fundings/record-fundings.service'
import { UserInfo } from '../../../types'
import { TogglzService } from '../../../core/togglz/togglz.service'

@Component({
    selector: 'app-fundings',
    templateUrl: './funding-stacks-groups.component.html',
    styleUrls: ['./funding-stacks-groups.component.scss'],
    standalone: false
})
export class FundingStacksGroupsComponent implements OnInit {
  $loading: Observable<boolean>

  @Input() userInfo: UserInfo
  @Input() isPublicRecord: any = false
  @Input() expandedContent: MainPanelsState
  @Output()
  expandedContentChange: EventEmitter<MainPanelsState> = new EventEmitter()

  @Output() total: EventEmitter<any> = new EventEmitter()
  userRecordContext: UserRecordOptions = {}
  userRecord: UserRecord
  $destroy: Subject<boolean> = new Subject<boolean>()
  userSession: UserSession
  fundings: FundingGroup[] = []

  ngOrcidFunding = $localize`:@@shared.funding:Funding`
  countryCodes: { key: string; value: string }[]
  loading = true
  sortTypes: SortOrderType[] = ['title', 'start', 'end', 'source']

  constructor(
    private _userSession: UserService,
    private _record: RecordService,
    private _recordFundingsService: RecordFundingsService,
    private _recordCountryService: RecordCountriesService,
    private _togglz: TogglzService
  ) {}

  ngOnInit(): void {
    this.getRecord()
  }

  private getRecord() {
    this.$loading = this._recordFundingsService.$loading
    this._userSession
      .getUserSession()
      .pipe(takeUntil(this.$destroy))
      .subscribe((userSession) => {
        this.userSession = userSession

        this._record
          .getRecord({
            publicRecordId: this.isPublicRecord || undefined,
          })
          .pipe(takeUntil(this.$destroy))
          .subscribe((userRecord) => {
            this.userRecord = userRecord
            if (userRecord?.fundings !== undefined) {
              this.loading = false
              this._recordCountryService
                .getCountryCodes()
                .pipe(first())
                .subscribe((codes) => {
                  this.countryCodes = codes
                  this.fundings.map((value) => {
                    value.fundings.forEach((funding) => {
                      if (funding?.country?.value) {
                        funding.countryForDisplay = this.countryCodes.find(
                          (x) => x.value === funding.country.value
                        ).key
                      }
                    })
                  })
                })

              this.fundings = userRecord.fundings
              this.total.emit(userRecord?.fundings?.length)
            }
          })
      })
  }

  trackByFundingGroup(index, item: FundingGroup) {
    return item.activePutCode
  }

  sortEvent(event: SortData) {
    this.userRecordContext.publicRecordId = this.isPublicRecord
    this.userRecordContext.sort = event.type
    this.userRecordContext.sortAsc = event.direction === 'asc'
    this._recordFundingsService.changeUserRecordContext(this.userRecordContext)
  }
}
