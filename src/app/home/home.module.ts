import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatDividerModule } from '@angular/material/divider'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { CoreModule } from 'src/app/core/core.module'

import { NewsComponent } from './components/news/news.component'
import { HomeRoutingModule } from './home-routing.module'
import { HomeComponent } from './pages/home/home.component'

@NgModule({
  imports: [
    CommonModule,
    HomeRoutingModule,
    MatButtonModule,
    CoreModule,
    MatProgressSpinnerModule,
    MatDividerModule,
  ],
  declarations: [HomeComponent, NewsComponent],
})
export class HomeModule {}
