import { LiveAnnouncer } from '@angular/cdk/a11y'
import { Component, OnDestroy, OnInit } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { MatPaginatorIntl, PageEvent } from '@angular/material/paginator'
import { Observable, of, Subject } from 'rxjs'
import {
  map,
  mergeMap,
  startWith,
  switchMap,
  take,
  takeUntil,
  tap,
} from 'rxjs/operators'
import { PlatformInfoService } from 'src/app/cdk/platform-info'
import {
  EMAIL_REGEXP_GENERIC,
  ORCID_REGEXP_CASE_INSENSITIVE,
} from 'src/app/constants'
import { UserService } from 'src/app/core'
import { AccountTrustedIndividualsService } from 'src/app/core/account-trusted-individuals/account-trusted-individuals.service'
import { AnnouncerService } from 'src/app/core/announcer/announcer.service'
import { SearchService } from 'src/app/core/search/search.service'
import { ExpandedSearchResultsContent, SearchResults } from 'src/app/types'
import { AccountTrustedIndividual } from 'src/app/types/account-trusted-individuals'
import { UserSession } from 'src/app/types/session.local'
import { environment } from 'src/environments/environment'
import { DialogAddTrustedIndividualsYourOwnEmailComponent } from '../dialog-add-trusted-individuals-your-own-email/dialog-add-trusted-individuals-your-own-email.component'
import { DialogAddTrustedIndividualsComponent } from '../dialog-add-trusted-individuals/dialog-add-trusted-individuals.component'

@Component({
  selector: 'app-settings-trusted-individuals-search',
  templateUrl: './settings-trusted-individuals-search.component.html',
  styleUrls: [
    './settings-trusted-individuals-search.component.scss',
    './settings-trusted-individuals-search.component.scss-theme.scss',
  ],
})
export class SettingsTrustedIndividualsSearchComponent
  implements OnInit, OnDestroy
{
  $destroy = new Subject()
  searchDone = false
  displayedColumns = ['trustedIndividuals', 'orcid', 'actions']
  isMobile: boolean
  searchValue: string
  $search: Observable<SearchResults>
  pageIndex: number
  pageSize: number
  ariaLabelPaginator = $localize`:@@search.paginator:paginator`
  loading: boolean
  baseUrl = environment.BASE_URL
  userSession: UserSession
  searchPlaceHolder = $localize`:@@account.searchIndividualsPlaceHolder:ORCID iD, email address, or names`
  trustedIndividuals: AccountTrustedIndividual[]
  searchResultsByName: boolean
  alreadyAddedLabel = $localize`:@@account.alreadyAdded:You already added this user`
  trustedPartiesUrl = '/trusted-parties'
  paginatorLabel: any
  trustedIndividualsLabel = $localize`:@@account.trustedIndividuals:Trusted individuals`

  constructor(
    private _search: SearchService,
    private dialog: MatDialog,
    private _platform: PlatformInfoService,
    private account: AccountTrustedIndividualsService,
    private _user: UserService,
    private _announcer: AnnouncerService,
    private _matPaginatorIntl: MatPaginatorIntl
  ) {}

  search(value: string) {
    this.loading = true
    value = value.trim().toLowerCase()
    const orcidIdMatch = this.extractOrcidId(value)
    const emailMatch = EMAIL_REGEXP_GENERIC.exec(value)?.[0]
    this.searchResultsByName = !orcidIdMatch && !emailMatch

    if (emailMatch) {
      this.$search = this.account.searchByEmail(emailMatch).pipe(
        map((response) => {
          if (response.isSelf) {
            this.announceThisIsYourOwnRecord()
          } else if (response.found && !response.isAlreadyAdded) {
            this.addByEmail(emailMatch)
            return null
          } else {
            return { 'expanded-result': [], 'num-found': 0 }
          }
        }),
        tap(() => {
          this.loading = false
        })
      )
    } else if (orcidIdMatch) {
      this.$search = this.account
        .searchByOrcid(orcidIdMatch.toUpperCase())
        .pipe(
          map((response) => {
            if (response.isSelf) {
              this.announceThisIsYourOwnRecord()
            } else if (response.found && !response.isAlreadyAdded) {
              this.addByOrcid(orcidIdMatch.toUpperCase())
              return null
            } else {
              return { 'expanded-result': [], 'num-found': 0 }
            }
          }),
          tap(() => {
            this.loading = false
          })
        )
    } else {
      this.$search = this.account.updateTrustedIndividualsSuccess.pipe(
        startWith({}),
        switchMap(() => this.account.get()),
        switchMap((currentTrustedIndividuals) => {
          return this._search
            .search({
              searchQuery: value,
              pageIndex: this.pageIndex || 0,
              pageSize: this.pageSize || 10,
            })
            .pipe(
              map((searchResults) => {
                return {
                  currentTrustedIndividuals,
                  searchResults,
                }
              })
            )
        }),

        map((search) => {
          if (search.searchResults['expanded-result']) {
            search.searchResults['expanded-result'] = search.searchResults[
              'expanded-result'
            ].map((searchResult) => {
              return {
                ...searchResult,
                alreadyOnRecord: this.resultIsMyOnRecordOrIsAlreadyAdded(
                  searchResult,
                  search.currentTrustedIndividuals
                ),
              }
            })
          }
          return search.searchResults
        }),
        tap((search) => {
          this.loading = false
        })
      )
    }
  }

  private resultIsMyOnRecordOrIsAlreadyAdded(
    searchResult: ExpandedSearchResultsContent,
    existingTrusteds: AccountTrustedIndividual[]
  ): boolean {
    return !!(
      searchResult['orcid-id'] ===
        this.userSession.userInfo.EFFECTIVE_USER_ORCID ||
      existingTrusteds.filter(
        (existingTrusted) =>
          existingTrusted.receiverOrcid.path.toLowerCase() ===
          searchResult['orcid-id'].toLowerCase()
      ).length
    )
  }

  private extractOrcidId(input: string): string {
    const regexResult = ORCID_REGEXP_CASE_INSENSITIVE.exec(input)
    if (regexResult) {
      return regexResult[0]
    }
    return null
  }

  add(value: ExpandedSearchResultsContent) {
    if (!value.alreadyOnRecord) {
      this.dialog
        .open(DialogAddTrustedIndividualsComponent, {
          data: value,
          width: '634px',
        })
        .afterClosed()
        .pipe(
          switchMap((value) => {
            if (value) {
              this.loading = true
              return this.account.add(value)
            }
            return of(undefined)
          })
        )
        .subscribe()
    }
  }

  addByEmail(value: string) {
    this.dialog
      .open(DialogAddTrustedIndividualsComponent, {
        data: value,
        width: '634px',
      })
      .afterClosed()
      .pipe(
        switchMap((value) => {
          if (value) {
            return this.account.addByEmail(value)
          }
          return of(undefined)
        })
      )
      .subscribe()
  }

  addByOrcid(value: string) {
    this.dialog
      .open(DialogAddTrustedIndividualsComponent, {
        data: value,
        width: '634px',
      })
      .afterClosed()
      .pipe(
        switchMap((value) => {
          if (value) {
            return this.account.addByOrcid(value)
          }
          return of(undefined)
        })
      )
      .subscribe()
  }

  announceThisIsYourOwnRecord() {
    this.dialog.open(DialogAddTrustedIndividualsYourOwnEmailComponent, {
      width: '634px',
    })
  }

  changePage(event: PageEvent) {
    this.pageIndex = event.pageIndex
    this.pageSize = event.pageSize
    this.paginatorLabel = this._matPaginatorIntl.getRangeLabel(
      event.pageIndex,
      event.pageSize,
      event.length
    )
    this._announcer.liveAnnouncePagination(event, this.trustedIndividualsLabel)
    this.search(this.searchValue)
  }
  ngOnInit(): void {
    this._platform
      .get()
      .pipe(takeUntil(this.$destroy))
      .subscribe((platform) => {
        this.isMobile = platform.columns4 || platform.columns8
      })
    this._user
      .getUserSession()
      .pipe(take(1))
      .subscribe((userSession) => {
        this.userSession = userSession
      })
  }

  ngOnDestroy(): void {
    this.$destroy.next()
    this.$destroy.unsubscribe()
  }
}
