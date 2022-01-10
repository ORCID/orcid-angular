import { Component, Input, OnInit } from '@angular/core'
import { ExternalIdentifier } from 'src/app/types/common.endpoint'

@Component({
  selector: 'app-display-external-ids',
  templateUrl: './display-external-ids.component.html',
  styleUrls: ['./display-external-ids.component.scss'],
})
export class DisplayExternalIdsComponent implements OnInit {
  @Input() externalIdentifiers: ExternalIdentifier[]
  @Input() noBoldTitle = false
  @Input() externalIdentifier: ExternalIdentifier
  externalIdentifiersList: ExternalIdentifier[]
  undefinedIdLabel = $localize`:@@share.undefinedId:undefined id`

  constructor() {}

  ngOnInit(): void {
    if (this.externalIdentifiers?.length > 0) {
      const doi = this.externalIdentifiers.filter((external) => external.externalIdentifierType?.value === 'doi')
      const source = this.externalIdentifiers.filter((external) => external.externalIdentifierType?.value === 'source-work-id')
      const others = this.externalIdentifiers.filter(
        (external) => external.externalIdentifierType?.value !== 'doi' && external.externalIdentifierType?.value !== 'source-work-id'
      )

      this.externalIdentifiersList = []
      this.externalIdentifiersList.push(...doi, ...source, ...others)
    }
    if (this.externalIdentifier) {
      this.externalIdentifiersList = Array.of(this.externalIdentifier)
    }
  }
}
