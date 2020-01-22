import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { Observable } from 'rxjs'
import { map } from 'rxjs/internal/operators/map'
import searchResults from '../../../../assets/mock-api-data.json'

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  searchResults = searchResults
  constructor(route: ActivatedRoute) {
    const id: Observable<string> = route.queryParams.pipe(
      map(p => p.searchQuery)
    )
    id.subscribe(console.log)
  }

  ngOnInit() {}
}
