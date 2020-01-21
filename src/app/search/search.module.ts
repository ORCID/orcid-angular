import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { SearchRoutingModule } from './search-routing.module'
import { SearchComponent } from './pages/search/search.component'
import { ResultsComponent } from './components/results/results.component'
import {
  MatPaginatorModule,
  MatButtonModule,
  MatIconModule,
} from '@angular/material'

@NgModule({
  declarations: [SearchComponent, ResultsComponent],
  imports: [
    CommonModule,
    SearchRoutingModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
  ],
})
export class SearchModule {}
