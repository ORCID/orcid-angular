import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import {
  MatButtonModule,
  MatProgressSpinnerModule,
  MatDividerModule,
} from '@angular/material'
import { CoreModule } from 'src/app/core/core.module'

import { NewsComponent } from './components/news/news.component'
import { HomeRoutingModule } from './home-routing.module'
import { HomeComponent } from './pages/home/home.component'
import { MultiRowRaisedButtonModule } from '../cdk/multi-row-raised-button/multi-row-raised-button.module'

@NgModule({
  imports: [
    CommonModule,
    HomeRoutingModule,
    MatButtonModule,
    CoreModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MultiRowRaisedButtonModule,
  ],
  declarations: [HomeComponent, NewsComponent],
})
export class HomeModule {}
