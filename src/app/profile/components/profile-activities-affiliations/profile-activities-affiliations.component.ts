import { Component, OnInit, Input } from '@angular/core'
import {
  AffiliationUIGroup,
  AffiliationUIGroupsTypes,
  AffiliationGroup,
} from 'src/app/types'
import { AffiliationsService } from 'src/app/core/affiliations/affiliations.service'
import { nestedListAnimation } from 'src/app/animations'

@Component({
  selector: 'app-profile-activities-affiliations',
  templateUrl: './profile-activities-affiliations.component.html',
  styleUrls: ['./profile-activities-affiliations.component.scss'],
  animations: [nestedListAnimation],
})
export class ProfileActivitiesAffiliationsComponent implements OnInit {
  panelState = true
  toggle = true
  affiliationUIGroupsTypes = AffiliationUIGroupsTypes

  @Input() id
  @Input() profileAffiliationsGroup: AffiliationUIGroup

  constructor(private _affiliations: AffiliationsService) {}

  trackByAffiliationGroup(index, item: AffiliationGroup) {
    return item.activePutCode
  }
  trackByProfileAffiliationUiGroups(index, item: AffiliationUIGroup) {
    return item.type
  }

  /**
   * The following function is a call to a temporall sorting method.
   * With the only purpose to have a quick sorting function to test the correct
   * funtionin of the components on data updates.
   *
   * This should be rewritten/removed when the funtionallity of sorting is implemented
   */
  testSorting() {
    this.toggle = !this.toggle
    this._affiliations.sort(this.toggle)
  }

  ngOnInit() {}
}
