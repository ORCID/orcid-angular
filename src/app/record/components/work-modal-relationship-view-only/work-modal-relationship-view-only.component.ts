import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { ExternalIdentifier } from 'src/app/types/common.endpoint'

@Component({
  selector: 'app-work-modal-relationship-view-only',
  templateUrl: './work-modal-relationship-view-only.component.html',
  styleUrls: ['./work-modal-relationship-view-only.component.scss'],
})
export class WorkModalRelationshipViewOnlyComponent implements OnInit {
  typeLabel = $localize`:@@record.type:Type:`
  valueLabel = $localize`:@@record.type:Value:`
  urlLabel = $localize`:@@record.type:Url:`
  relationshipLabel = $localize`:@@record.relationship:Relationship:`

  @Output() edit = new EventEmitter<void>()
  @Output() delete = new EventEmitter<void>()

  @Input() workIdentifier: {
    externalIdentifierId: string
    externalIdentifierType: string
    externalIdentifierUrl: string
    externalRelationship: string
  }
  constructor() {}

  ngOnInit(): void {}
}
