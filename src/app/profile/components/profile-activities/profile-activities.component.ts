import { Component, Input, OnInit, ViewChild, ElementRef } from '@angular/core'
import { nestedListAnimation } from 'src/app/animations'
import {
  AffiliationUIGroup,
  AffiliationUIGroupsTypes,
  Works,
  AffiliationGroup,
} from 'src/app/types'
import { AffiliationsSortService } from 'src/app/core'
import { ChangeDetectorRef } from '@angular/core'
import { PageEvent } from '@angular/material'
import { WorksService } from '../../../core/works/works.service'
import { Subscription, timer } from 'rxjs'

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
}
