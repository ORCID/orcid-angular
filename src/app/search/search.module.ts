import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { SearchRoutingModule } from './search-routing.module'
import { SearchComponent } from './pages/search/search.component'
import { ResultsComponent } from './components/results/results.component'
import {
  MatPaginatorModule,
  MatButtonModule,
  MatIconModule,
  MatProgressSpinnerModule,
  MatFormFieldModule,
  MatInputModule,
  MatCheckboxModule,
} from '@angular/material'
import { AdvanceSearchComponent } from './components/advance-search/advance-search.component'
import { BidiModule } from '@angular/cdk/bidi'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'

@NgModule({
  declarations: [SearchComponent, ResultsComponent, AdvanceSearchComponent],
  imports: [
    CommonModule,
    SearchRoutingModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatInputModule,
    MatFormFieldModule,
    MatCheckboxModule,
    BidiModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [ResultsComponent],
})
export class SearchModule {}
