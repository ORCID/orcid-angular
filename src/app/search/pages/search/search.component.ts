import { Component, OnInit, Optional } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { SearchService } from '../../../core/search/search.service'
import { tap, switchMap, retry, catchError } from 'rxjs/operators'
import { PageEvent } from '@angular/material/paginator'
import { SearchResults } from 'src/app/types'
import { SearchParameters } from 'src/app/types'
import { Meta } from '@angular/platform-browser'
import { EMPTY } from 'rxjs'

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  searchResults: SearchResults
  searchParams
  pageIndex: number
  pageSize: number
  loadingNewResults = false

  constructor(
    route: ActivatedRoute,
    private _searchService: SearchService,
    @Optional() private router: Router,
    meta: Meta
  ) {
    meta.updateTag({ name: 'robots', content: 'NOINDEX, NOFOLLOW' })
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
        switchMap(value =>
          _searchService.search(value).pipe(
            retry(3),
            catchError(err => EMPTY)
          )
        )
      )
      .subscribe(data => {
        this.loadingNewResults = false
        this.searchResults = data
      })
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
