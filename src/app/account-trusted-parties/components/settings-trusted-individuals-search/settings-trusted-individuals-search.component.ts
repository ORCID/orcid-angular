import { Component, OnDestroy, OnInit } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { PageEvent } from '@angular/material/paginator'
import { Observable, Subject } from 'rxjs'
import { takeUntil, tap } from 'rxjs/operators'
import { PlatformInfoService } from 'src/app/cdk/platform-info'
import { AccountTrustedIndividualsService } from 'src/app/core/account-trusted-individuals/account-trusted-individuals.service'
import { SearchService } from 'src/app/core/search/search.service'
import { ExpandedSearchResultsContent, SearchResults } from 'src/app/types'
import { environment } from 'src/environments/environment'
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
  implements OnInit, OnDestroy {
  searchDone = false
  displayedColumns = ['trustedIndividuals', 'orcid', 'actions']
  platformSubs = new Subject<void>()
  isMobile: boolean
  searchValue: string
  $trustedIndividuals: Observable<SearchResults>
  pageIndex: number
  pageSize: number
  ariaLabelPaginator = $localize`:@@search.paginator:paginator`
  loading: boolean
  baseUrl = environment.BASE_URL

  constructor(
    private _search: SearchService,
    private dialog: MatDialog,
    private _platform: PlatformInfoService,
    private account: AccountTrustedIndividualsService
  ) {}
  ngOnDestroy(): void {
    this.platformSubs.next()
    this.platformSubs.complete()
  }

  search(value: string) {
    this.loading = true
    this.$trustedIndividuals = this._search
      .search({
        searchQuery: value,
        pageIndex: this.pageIndex || 0,
        pageSize: this.pageSize || 50,
      })
      .pipe(
        tap((trustedIndividuals) => {
          trustedIndividuals['expanded-result'].forEach((ti) => {
            if (ti['orcid-id'] === this.searchValue) {
              this.add(ti)
            }
          })
          this.loading = false
        })
      )
  }

  add(value: ExpandedSearchResultsContent) {
    this.dialog
      .open(DialogAddTrustedIndividualsComponent, {
        data: value,
      })
      .afterClosed()
      .subscribe()
  }

  changePage(event: PageEvent) {
    this.pageIndex = event.pageIndex
    this.pageSize = event.pageSize
    this.search(this.searchValue)
  }
  ngOnInit(): void {
    this._platform
      .get()
      .pipe(takeUntil(this.platformSubs))
      .subscribe((platform) => {
        this.isMobile = platform.columns4 || platform.columns8
      })
  }
}
