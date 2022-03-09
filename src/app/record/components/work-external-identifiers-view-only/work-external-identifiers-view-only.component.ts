import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { WorkRelationships } from 'src/app/types/works.endpoint'
import { FormGroup } from '@angular/forms'

@Component({
  selector: 'app-work-external-identifiers-view-only',
  templateUrl: './work-external-identifiers-view-only.component.html',
  styleUrls: ['./work-external-identifiers-view-only.component.scss'],
})
export class WorkExternalIdentifiersViewOnlyComponent  {
  typeLabel = $localize`:@@works.typeColon:Type:`
  valueLabel = $localize`:@@works.value:Value:`
  urlLabel = $localize`:@@works.urlColon:URL:`
  relationshipLabel = $localize`:@@shared.relationshipColon:Relationship:`

  @Output() edit = new EventEmitter<void>()
  @Output() delete = new EventEmitter<void>()

  @Input() workIdentifier: {
    externalIdentifierId: string
    externalIdentifierType: string
    externalIdentifierUrl: string
    externalRelationship: WorkRelationships
  }
  @Input() externalIdForm: FormGroup

  constructor() {}
}
