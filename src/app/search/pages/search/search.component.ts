import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import searchResults from '../../../../assets/mock-api-data.json'
import { SearchService } from 'src/app/core/search/search.service.js'

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  searchResults = searchResults
  constructor(route: ActivatedRoute, _searchService: SearchService) {
    // TODO check how the component is initialized and router is triggered on a second search
    _searchService.search(route.queryParams).subscribe(data => {
      console.log('RESULTS FOR ', data)
    })
  }

  ngOnInit() {}
}
