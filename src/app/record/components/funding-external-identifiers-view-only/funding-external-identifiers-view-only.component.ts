import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { FundingRelationships } from 'src/app/types/record-funding.endpoint'

@Component({
    selector: 'app-funding-external-identifiers-view-only',
    templateUrl: './funding-external-identifiers-view-only.component.html',
    styleUrls: ['./funding-external-identifiers-view-only.component.scss'],
    standalone: false
})
export class FundingExternalIdentifiersViewOnlyComponent implements OnInit {
  grantNumberLabel = $localize`:@@funding.grantNumberColon:Grant number:`
  grantUrlLabel = $localize`:@@funding.grantUrlColon:Grant URL:`
  fundingRelationshipLabel = $localize`:@@shared.relationshipColon:Relationship:`

  @Output() edit = new EventEmitter<void>()
  @Output() delete = new EventEmitter<void>()

  @Input() grant: {
    grantNumber: string
    grantUrl: string
    fundingRelationship: FundingRelationships
  }

  constructor() {}

  ngOnInit(): void {}
}
