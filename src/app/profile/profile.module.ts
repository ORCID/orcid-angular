import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'

import { SharedModule } from 'src/app/shared/shared.module'
import { ProfileBiographyComponent } from './components/profile-biography/profile-biography.component'
import { ProfileInfoDetailComponent } from './components/profile-person-detail/profile-person-detail.component'
import { ProfileInfoComponent } from './components/profile-person/profile-person.component'
import { CardDetailComponent } from './components/card-detail/card-detail.component'
import { CardComponent } from './components/card/card.component'
import { ProfileRecordsComponent } from './components/profile-activities/profile-activities.component'
import { ProfilePageComponent } from './pages/profile-page/profile-page.component'
import { ProfileRoutingModule } from './profile-routing.module'
import { ProfileActivitiesWorkComponent } from './components/profile-activities-work/profile-activities-work.component'
import { ProfileActivitiesWorksComponent } from './components/profile-activities-works/profile-activities-works.component'
import { ProfileRecordsAffiliationComponent } from './components/profile-activities-affiliation/profile-activities-affiliation.component'
import { CardDetailLineComponent } from './components/card-detail-line/card-detail-line.component'
// tslint:disable-next-line:max-line-length
import { ProfileActivitiesAffiliationsComponent } from './components/profile-activities-affiliations/profile-activities-affiliations.component'

@NgModule({
  imports: [CommonModule, ProfileRoutingModule, SharedModule],
  declarations: [
    ProfileInfoComponent,
    ProfileBiographyComponent,
    ProfileRecordsComponent,
    ProfilePageComponent,
    ProfileInfoDetailComponent,
    CardComponent,
    CardDetailComponent,
    ProfileActivitiesWorksComponent,
    ProfileActivitiesWorkComponent,
    ProfileRecordsAffiliationComponent,
    CardDetailLineComponent,
    ProfileActivitiesAffiliationsComponent,
  ],
})
export class ProfileModule {}
