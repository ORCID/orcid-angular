import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'

@Component({
  selector: 'app-funding-external-identifiers-view-only',
  templateUrl: './funding-external-identifiers-view-only.component.html',
  styleUrls: ['./funding-external-identifiers-view-only.component.scss'],
})
export class FundingExternalIdentifiersViewOnlyComponent implements OnInit {
  typeLabel = $localize`:@@record.type:Type:`
  valueLabel = $localize`:@@record.type:Value:`
  urlLabel = $localize`:@@record.type:Url:`
  relationshipLabel = $localize`:@@record.relationship:Relationship:`

  @Output() edit = new EventEmitter<void>()
  @Output() delete = new EventEmitter<void>()

  @Input() grant: {
    grantNumber: string
    grantUrl: string
    fundingRelationship: string
  }
  constructor() {}

  ngOnInit(): void {}
}
