import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { SearchRoutingModule } from './search-routing.module'
import { SearchComponent } from './pages/search/search.component'
import { ResultsComponent } from './components/results/results.component'

@NgModule({
  declarations: [SearchComponent, ResultsComponent],
  imports: [CommonModule, SearchRoutingModule],
})
export class SearchModule {}
