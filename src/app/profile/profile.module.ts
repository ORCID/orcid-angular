import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { ProfileRoutingModule } from './profile-routing.module'
import { PublicPageComponent } from './pages/public-page/public-page.component'
import { ProfileGeneralDataComponent } from './components/profile-general-data/profile-general-data.component'
import { ProfileBiographyComponent } from './components/profile-biography/profile-biography.component'
import { ProfileRecordsComponent } from './components/profile-records/profile-records.component'

@NgModule({
  imports: [CommonModule, ProfileRoutingModule],
  declarations: [
    PublicPageComponent,
    ProfileGeneralDataComponent,
    ProfileBiographyComponent,
    ProfileRecordsComponent,
  ],
})
export class ProfileModule {}
