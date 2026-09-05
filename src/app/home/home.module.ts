import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatDividerModule } from '@angular/material/divider'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { MatTabsModule } from '@angular/material/tabs'
import { CoreModule } from 'src/app/core/core.module'

import { NewsComponent } from './components/news/news.component'
import { HomepageFeatureCardComponent } from './components/homepage-feature-card/homepage-feature-card.component'
import { HomepageFeaturedNewsComponent } from './components/homepage-featured-news/homepage-featured-news.component'
import { HomepageHeroComponent } from './components/homepage-hero/homepage-hero.component'
import { HomepageIntegrateComponent } from './components/homepage-integrate/homepage-integrate.component'
import { RichTextComponent } from './components/rich-text/rich-text.component'
import { HomeRoutingModule } from './home-routing.module'
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
  ],
  declarations: [
    HomeComponent,
    HomepagePreviewComponent,
    NewsComponent,
    HomepageHeroComponent,
    HomepageFeatureCardComponent,
    HomepageFeaturedNewsComponent,
    HomepageIntegrateComponent,
    RichTextComponent,
  ],
})
export class HomeModule {}
