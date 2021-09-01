import { Component, OnDestroy, OnInit, Optional } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { SearchService } from '../../../core/search/search.service'
import { tap, switchMap, retry, catchError } from 'rxjs/operators'
import { PageEvent } from '@angular/material/paginator'
import { SearchResults } from 'src/app/types'
import { SearchParameters } from 'src/app/types'
import { Meta } from '@angular/platform-browser'
import { EMPTY } from 'rxjs'
import { RobotsMetaTagsService } from 'src/app/core/robots-meta-tags/robots-meta-tags.service'

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit, OnDestroy {
  searchResults: SearchResults
  searchParams
  pageIndex: number
  pageSize: number
  loadingNewResults = false
  ariaLabelPaginator = $localize`:@@search.paginator:paginator`
  ariaLabelBottomPaginator = $localize`:@@search.bottomPaginator:bottom paginator`

  constructor(
    route: ActivatedRoute,
    private _searchService: SearchService,
    @Optional() private router: Router,
    meta: Meta,
    private _robotsMetadata: RobotsMetaTagsService
  ) {
    this._robotsMetadata.disallowRobots()
    route.queryParams
      .pipe(
        // Set the query parameters to the advanced search
        tap((value: SearchParameters) => {
          this.searchParams = this._searchService.searchParametersAdapter(value)
          this.pageIndex = value.pageIndex || 0
          this.pageSize = value.pageSize || 50
          this.loadingNewResults = true
        }),
        // Call the backend to get search results
        switchMap((value) =>
          _searchService.search(value).pipe(
            retry(3),
            catchError((err) => EMPTY)
          )
        )
      )
      .subscribe((data) => {
        this.loadingNewResults = false
        this.searchResults = data
      })
  }
  ngOnDestroy(): void {
    this._robotsMetadata.restoreEnvironmentRobotsConfig()
  }

  changePage(event: PageEvent) {
    this.pageIndex = event.pageIndex
    this.pageSize = event.pageSize

    this.router.navigate(['/orcid-search/search'], {
      queryParams: {
        ...this.searchParams,
        pageSize: this.pageSize,
        pageIndex: this.pageIndex,
      },
    })
  }

  ngOnInit() {}
}
