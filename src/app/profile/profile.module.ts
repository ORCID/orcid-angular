import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'

import { SharedModule } from 'src/app/shared/shared.module'
import { ProfileBiographyComponent } from './components/profile-biography/profile-biography.component'
import { ProfileGeneralDataDetailComponent } from './components/profile-general-data-detail/profile-general-data-detail.component'
import { ProfileGeneralDataComponent } from './components/profile-general-data/profile-general-data.component'
import { ProfileRecordsCardDetailComponent } from './components/profile-records-card-detail/profile-records-card-detail.component'
import { ProfileRecordsCardComponent } from './components/profile-records-card/profile-records-card.component'
import { ProfileRecordsComponent } from './components/profile-records/profile-records.component'
import { ProfilePageComponent } from './pages/profile-page/profile-page.component'
import { ProfileRoutingModule } from './profile-routing.module'
import { ProfileRecordsStackComponent } from './components/profile-records-stack/profile-records-stack.component'

@NgModule({
  imports: [CommonModule, ProfileRoutingModule, SharedModule],
  declarations: [
    ProfileGeneralDataComponent,
    ProfileBiographyComponent,
    ProfileRecordsComponent,
    ProfilePageComponent,
    ProfileGeneralDataDetailComponent,
    ProfileRecordsCardComponent,
    ProfileRecordsCardDetailComponent,
    ProfileRecordsStackComponent,
  ],
})
export class ProfileModule {}
