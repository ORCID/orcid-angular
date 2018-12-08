import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { HomeRoutingModule } from './home-routing.module'
import { HomeComponent } from './pages/home/home.component'
import { NewsComponent } from './components/news/news.component'
import { MatButtonModule, MatRippleModule } from '@angular/material'
import { CoreModule } from '../core/core.module'

@NgModule({
  imports: [
    CommonModule,
    HomeRoutingModule,
    MatButtonModule,
    CoreModule,
    MatRippleModule,
  ],
  declarations: [HomeComponent, NewsComponent],
})
export class HomeModule {}
