import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { SearchService } from '../../../core/search/search.service'

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  searchResults
  constructor(route: ActivatedRoute, _searchService: SearchService) {
    _searchService.search(route.queryParams).subscribe(data => {
      console.log('RESULTS FOR ', data)
      this.searchResults = data
    })
  }

  ngOnInit() {
    console.log('INIT!')
  }
}
