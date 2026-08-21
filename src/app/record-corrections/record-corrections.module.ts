import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { SkeletonPlaceholderComponent } from '@orcid/ui'
import { RecordCorrectionsRoutingModule } from './record-corrections-routing.module'
import { RecordCorrectionsComponent } from './pages/record-corrections/record-corrections.component'

@NgModule({
  declarations: [RecordCorrectionsComponent],
  imports: [
    CommonModule,
    RecordCorrectionsRoutingModule,
    SkeletonPlaceholderComponent,
  ],
})
export class RecordCorrectionsModule {}
