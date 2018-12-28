import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'

import { ProfileBiographyComponent } from './components/profile-biography/profile-biography.component'
import { ProfileGeneralDataComponent } from './components/profile-general-data/profile-general-data.component'
import { ProfileRecordsComponent } from './components/profile-records/profile-records.component'
import { ProfilePageComponent } from './pages/profile-page/profile-page.component'
import { ProfileRoutingModule } from './profile-routing.module'

@NgModule({
  imports: [CommonModule, ProfileRoutingModule],
  declarations: [
    ProfileGeneralDataComponent,
    ProfileBiographyComponent,
    ProfileRecordsComponent,
    ProfilePageComponent,
  ],
})
export class ProfileModule {}
