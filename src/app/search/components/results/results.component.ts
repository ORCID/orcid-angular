import {
  Component,
  OnInit,
  Input,
  SimpleChanges,
  OnChanges,
} from '@angular/core'
import { SearchResults, ExpandedSearchResultsContent } from 'src/app/types'

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: [
    './results.component.scss-theme.scss',
    './results.component.scss',
  ],
  preserveWhitespaces: true,
  standalone: false,
})
export class ResultsComponent implements OnInit, OnChanges {
  ngOrcidSearchResults = $localize`:@@ngOrcid.search.ariaLabelSearchResults:Search Results`

  @Input() searchResults: SearchResults
  resultsContent: ExpandedSearchResultsContent[]

  constructor() {}
  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges): void {
    this.resultsContent =
      this.searchResults && this.searchResults['expanded-result']
  }
}
