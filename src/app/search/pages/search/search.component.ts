import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { SearchService } from '../../../core/search/search.service'
import { map, tap, switchMap } from 'rxjs/operators'

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  searchResults
  searchParams
  constructor(route: ActivatedRoute, _searchService: SearchService) {
    route.queryParams
      .pipe(
        // Set the query parameters to the advance search
        tap(value => {
          this.searchParams = value
        }),
        // Call the backend to get search results
        switchMap(value => _searchService.search(value))
      )
      .subscribe(data => {
        this.searchResults = data
      })
  }

  ngOnInit() {
    console.log('INIT!')
  }
}
