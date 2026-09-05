import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatDividerModule } from '@angular/material/divider'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { MatTabsModule } from '@angular/material/tabs'
import { CoreModule } from 'src/app/core/core.module'

import { NewsComponent } from './components/news/news.component'
import { HomeRoutingModule } from './home-routing.module'
import { HomepagePageComponent } from './components/homepage-page/homepage-page.component'
import { HomeComponent } from './pages/home/home.component'
import { HomepagePreviewComponent } from './pages/homepage-preview/homepage-preview.component'

@NgModule({
  imports: [
    CommonModule,
    HomeRoutingModule,
    MatButtonModule,
    CoreModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatTabsModule,
    HomepagePageComponent,
  ],
  declarations: [HomeComponent, HomepagePreviewComponent, NewsComponent],
})
export class HomeModule {}
