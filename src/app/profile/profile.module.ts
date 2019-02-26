import { NgModule } from '@angular/core'
import { SharedModule } from 'src/app/shared/shared.module'

import { CardDetailLineComponent } from './components/card-detail-line/card-detail-line.component'
import { CardDetailComponent } from './components/card-detail/card-detail.component'
import { CardComponent } from './components/card/card.component'
import { ProfileRecordsAffiliationComponent } from './components/profile-activities-affiliation/profile-activities-affiliation.component'
// tslint:disable-next-line:max-line-length
import { ProfileActivitiesAffiliationsComponent } from './components/profile-activities-affiliations/profile-activities-affiliations.component'
import { ProfileActivitiesWorkComponent } from './components/profile-activities-work/profile-activities-work.component'
import { ProfileActivitiesWorksComponent } from './components/profile-activities-works/profile-activities-works.component'
import { ProfileRecordsComponent } from './components/profile-activities/profile-activities.component'
import { ProfileBiographyComponent } from './components/profile-biography/profile-biography.component'
import { ProfileInfoDetailComponent } from './components/profile-person-detail/profile-person-detail.component'
import { ProfileInfoComponent } from './components/profile-person/profile-person.component'
import { ProfilePageComponent } from './pages/profile-page/profile-page.component'
import { ProfileRoutingModule } from './profile-routing.module'

// tslint:disable-next-line:max-line-length
@NgModule({
  imports: [ProfileRoutingModule, SharedModule],
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
