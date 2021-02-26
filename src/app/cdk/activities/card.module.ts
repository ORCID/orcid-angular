import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { CardComponent } from 'src/app/profile/components/card/card.component'
import { CardDetailComponent } from 'src/app/profile/components/card-detail/card-detail.component'
import { CardDetailLineComponent } from 'src/app/profile/components/card-detail-line/card-detail-line.component'
import { SharedModule } from 'src/app/shared/shared.module'

@NgModule({
  declarations: [CardComponent, CardDetailComponent, CardDetailLineComponent],
  exports: [CardComponent, CardDetailComponent, CardDetailLineComponent],
  imports: [CommonModule, SharedModule],
})
export class ActivitiesModule {}
