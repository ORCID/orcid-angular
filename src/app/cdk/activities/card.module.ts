import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { CardComponent } from 'src/app/profile/components/card/card.component'
import { CardDetailComponent } from 'src/app/profile/components/card-detail/card-detail.component'
import { CardDetailLineComponent } from 'src/app/profile/components/card-detail-line/card-detail-line.component'
import { SharedModule } from 'src/app/shared/shared.module'
import { StackContainerComponent } from './stack-container/stack-container.component'
import { StackContainerHeaderComponent } from './stack-container-header/stack-container-header.component'
import { MatIconModule } from '@angular/material/icon'

@NgModule({
  declarations: [
    CardComponent,
    CardDetailComponent,
    CardDetailLineComponent,
    StackContainerComponent,
    StackContainerHeaderComponent,
  ],
  exports: [
    CardComponent,
    CardDetailComponent,
    CardDetailLineComponent,
    StackContainerComponent,
    StackContainerHeaderComponent,
  ],
  imports: [CommonModule, SharedModule, MatIconModule],
})
export class CardModule {}
