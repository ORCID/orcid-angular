import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { SharedModule } from 'src/app/shared/shared.module'
import { StackContainerComponent } from './stack-container/stack-container.component'
import { StackContainerHeaderComponent } from './stack-container-header/stack-container-header.component'
import { MatIconModule } from '@angular/material/icon'
import { CardDetailComponent } from './card-detail/card-detail.component'
import { CardComponent } from './card/card.component'
import { CardDetailLineComponent } from './card-detail-line/card-detail-line.component'
import { CardHeaderComponent } from './card-header/card-header.component';
import { CardDataComponent } from './card-data/card-data.component';
import { CardSourceComponent } from './card-source/card-source.component';
import { CardOtherSourcesComponent } from './card-other-sources/card-other-sources.component'

@NgModule({
  declarations: [
    CardComponent,
    CardDetailComponent,
    CardDetailLineComponent,
    StackContainerComponent,
    StackContainerHeaderComponent,
    CardHeaderComponent,
    CardDataComponent,
    CardSourceComponent,
    CardOtherSourcesComponent,
  ],
  exports: [
    CardComponent,
    CardDetailComponent,
    CardDetailLineComponent,
    StackContainerComponent,
    StackContainerHeaderComponent,
    CardHeaderComponent,
  ],
  imports: [CommonModule, SharedModule, MatIconModule],
})
export class CardModule {}
