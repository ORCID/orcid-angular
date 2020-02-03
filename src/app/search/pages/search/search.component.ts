import { Component, OnInit, Optional } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { SearchService } from '../../../core/search/search.service'
import { map, tap, switchMap } from 'rxjs/operators'
import { PageEvent } from '@angular/material'

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  searchResults
  searchParams
  pageIndex
  pageSize
  loadingNewResults = false

  constructor(
    route: ActivatedRoute,
    _searchService: SearchService,
    @Optional() private router: Router
  ) {
    route.queryParams
      .pipe(
        // Set the query parameters to the advance search
        tap(value => {
          this.searchParams = value
          this.pageIndex = value.pageIndex || 0
          this.pageSize = value.pageSize || 50
          this.loadingNewResults = true
        }),
        // Call the backend to get search results
        switchMap(value => _searchService.search(value))
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

  ngOnInit() {
    console.log('INIT!')
  }
}
