import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { SearchRoutingModule } from './search-routing.module'
import { SearchComponent } from './pages/search/search.component'
import { ResultsComponent } from './components/results/results.component'
import { MatButtonModule } from '@angular/material/button'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { MatPaginatorModule } from '@angular/material/paginator'
import { MatProgressBarModule } from '@angular/material/progress-bar'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { AdvanceSearchComponent } from './components/advance-search/advance-search.component'
import { BidiModule } from '@angular/cdk/bidi'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { FormDirectivesModule } from '../cdk/form-directives/form-directives.module'
import { SharedModule } from '../shared/shared.module'

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
    MatProgressBarModule,
    FormDirectivesModule,
    SharedModule,
  ],
  exports: [ResultsComponent, AdvanceSearchComponent],
})
export class SearchModule {}
