import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { HomeRoutingModule } from './home-routing.module'
import { HomeComponent } from './pages/home/home.component'
import { NewsComponent } from './components/news/news.component'
import { MatButtonModule } from '@angular/material'

@NgModule({
  imports: [CommonModule, HomeRoutingModule, MatButtonModule],
  declarations: [HomeComponent, NewsComponent],
})
export class HomeModule {}
