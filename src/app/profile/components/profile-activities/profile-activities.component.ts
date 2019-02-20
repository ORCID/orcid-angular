import { Component, Input, OnInit } from '@angular/core'
import { nestedListAnimation } from 'src/app/animations'
import { AffiliationUIGroup } from 'src/app/types'

@Component({
  selector: 'app-profile-activities',
  templateUrl: './profile-activities.component.html',
  styleUrls: ['./profile-activities.component.scss'],
  animations: [nestedListAnimation],
})
export class ProfileRecordsComponent implements OnInit {
  @Input() id
  @Input() profileWorks
  @Input() profileAffiliationUiGroups

  ngOnInit() {}

  trackByProfileAffiliationUiGroups(index, item: AffiliationUIGroup) {
    return item.type
  }
}
