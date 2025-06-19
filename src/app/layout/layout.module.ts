import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatRippleModule } from '@angular/material/core'
import { MatIconModule } from '@angular/material/icon'
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu'
import { RouterModule } from '@angular/router'

import { FooterComponent } from './footer/footer.component'
import { HeaderComponent } from './header/header.component'
import { SearchComponent } from './search/search.component'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MenuIconComponent } from './menu-icon/menu-icon.component'
import { LanguageComponent } from './language/language.component'
import { CoreModule } from '../core/core.module'
import { UserMenuComponent } from './user-menu/user-menu.component'
import { StatisticsComponent } from './statistics/statistics.component'
import { SkipMainNavComponent } from './skip-main-nav/skip-main-nav.component'
import { BannersComponent } from './banners/banners.component'
import { BannerModule } from '../cdk/banner/banner.module'
import { MaintenanceMessageComponent } from './maintenance-message/maintenance-message.component'
import { MatDividerModule } from '@angular/material/divider'
import { A11yLinkModule } from '../cdk/a11y-link/a11y-link.module'
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip'

@NgModule({
  imports: [
    CommonModule,
    CoreModule,
    MatMenuModule,
    MatButtonModule,
    RouterModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    MatRippleModule,
    MatIconModule,
    BannerModule,
    MatDividerModule,
    A11yLinkModule,
    MatTooltipModule,
  ],
  declarations: [
    HeaderComponent,
    FooterComponent,
    SearchComponent,
    MenuIconComponent,
    LanguageComponent,
    UserMenuComponent,
    StatisticsComponent,
    SkipMainNavComponent,
    BannersComponent,
    MaintenanceMessageComponent,
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    SkipMainNavComponent,
    BannersComponent,
    StatisticsComponent,
  ],
})
export class LayoutModule {}
