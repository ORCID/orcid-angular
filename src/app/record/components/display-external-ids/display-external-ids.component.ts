import { Component, Input, OnInit } from '@angular/core'
import { ExternalIdentifier } from 'src/app/types/common.endpoint'

@Component({
  selector: 'app-display-external-ids',
  templateUrl: './display-external-ids.component.html',
  styleUrls: ['./display-external-ids.component.scss'],
  standalone: false,
})
export class DisplayExternalIdsComponent implements OnInit {
  @Input() externalIdentifiers: ExternalIdentifier[]
  @Input() noBoldTitle = false
  @Input() externalIdentifier: ExternalIdentifier
  undefinedIdLabel = $localize`:@@share.undefinedId:undefined id`

  constructor() {}

  ngOnInit(): void {}

  getExternalIdentifiers(): ExternalIdentifier[] {
    const externalIdentifiersList: ExternalIdentifier[] = []
    if (this.externalIdentifiers?.length > 0) {
      const doi = this.externalIdentifiers.filter(
        (external) => external.externalIdentifierType?.value === 'doi'
      )
      const source = this.externalIdentifiers.filter(
        (external) =>
          external.externalIdentifierType?.value === 'source-work-id'
      )
      const others = this.externalIdentifiers.filter(
        (external) =>
          external.externalIdentifierType?.value !== 'doi' &&
          external.externalIdentifierType?.value !== 'source-work-id'
      )

      externalIdentifiersList.push(...doi, ...source, ...others)
    } else {
      if (this.externalIdentifier) {
        this.externalIdentifiers = Array.of(this.externalIdentifier)
      }
    }
    return externalIdentifiersList
  }
}
