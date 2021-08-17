import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { isEmpty } from 'lodash'
import { Subject } from 'rxjs'
import { first, takeUntil } from 'rxjs/operators'
import { UserService } from 'src/app/core'
import { RecordCountriesService } from 'src/app/core/record-countries/record-countries.service'
import { RecordService } from 'src/app/core/record/record.service'
import { FundingGroup } from 'src/app/types/record-funding.endpoint'
import { UserRecordOptions } from 'src/app/types/record.local'
import { UserSession } from 'src/app/types/session.local'
import { SortData } from 'src/app/types/sort'

import { RecordFundingsService } from '../../../core/record-fundings/record-fundings.service'
import { UserInfo } from '../../../types'

@Component({
  selector: 'app-fundings',
  templateUrl: './funding-stacks-groups.component.html',
  styleUrls: ['./funding-stacks-groups.component.scss'],
})
export class FundingStacksGroupsComponent implements OnInit {
  labelAddButton = $localize`:@@shared.addFunding:Add Funding`
  labelSortButton = $localize`:@@shared.sortFundings:Sort Fundings`
  @Input() userInfo: UserInfo
  @Input() isPublicRecord: any = false
  @Input() expandedContent: boolean
  @Output() total: EventEmitter<any> = new EventEmitter()
  @Output() expanded: EventEmitter<any> = new EventEmitter()
  userRecordContext: UserRecordOptions = {}

  $destroy: Subject<boolean> = new Subject<boolean>()
  userSession: UserSession
  fundings: FundingGroup[]

  ngOrcidFunding = $localize`:@@shared.funding:Funding`
  countryCodes: { key: string; value: string }[]

  constructor(
    private _userSession: UserService,
    private _record: RecordService,
    private _recordFundingsService: RecordFundingsService,
    private _recordCountryService: RecordCountriesService
  ) {}

  ngOnInit(): void {
    this.getRecord()
  }

  private getRecord() {
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
            if (!isEmpty(userRecord.fundings)) {
              this._recordCountryService
                .getCountryCodes()
                .pipe(first())
                .subscribe((codes) => {
                  this.countryCodes = Object.entries(codes).map((keyValue) => {
                    return { key: keyValue[0], value: keyValue[1] }
                  })
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

  expandedClicked(expanded: boolean) {
    this.expanded.emit({ type: 'fundings', expanded })
  }

  sortEvent(event: SortData) {
    this.userRecordContext.publicRecordId = this.isPublicRecord
    this.userRecordContext.sort = event.type
    this.userRecordContext.sortAsc = event.direction === 'asc'
    this._recordFundingsService.changeUserRecordContext(this.userRecordContext)
  }
}
