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
  @Input() id
  _profileAffiliationsGroup: AffiliationUIGroup
  @Input()
  set profileAffiliationsGroup(value) {
    this._profileAffiliationsGroup = value
  }
  get profileAffiliationsGroup() {
    return this._profileAffiliationsGroup
  }
  panelState = true
  affiliationUIGroupsTypes = AffiliationUIGroupsTypes
  // TODO delete testSorting function and toggle
  toggle = true

  constructor(private _affiliations: AffiliationsService) {}

  trackByAffiliationGroup(index, item: AffiliationGroup) {
    return item.activePutCode
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
    this._affiliations.sort(this.toggle).subscribe()
  }

  ngOnInit() {}
}
