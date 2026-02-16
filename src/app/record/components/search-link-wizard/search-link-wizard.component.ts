import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core'
import { RecordImportWizard } from '../../../types/record-peer-review-import.endpoint'

@Component({
  selector: 'app-search-link-wizard',
  templateUrl: './search-link-wizard.component.html',
  styleUrls: ['./search-link-wizard.component.scss'],
  standalone: false,
})
export class SearchLinkWizardComponent implements OnInit, OnChanges {
  @Input() recordImportWizards: RecordImportWizard[]

  certifiedWizards: RecordImportWizard[] = []
  featuredWizards: RecordImportWizard[] = []
  defaultWizards: RecordImportWizard[] = []

  constructor() {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.recordImportWizards) {
      this.groupWizards()
    }
  }

  displayDescription(recordImportWizard: RecordImportWizard): string {
    return (
      recordImportWizard?.redirectUriMetadata?.defaultDescription ||
      recordImportWizard?.description ||
      ''
    )
  }

  private groupWizards(): void {
    const wizards = this.recordImportWizards || []

    const certified: RecordImportWizard[] = []
    const featured: RecordImportWizard[] = []
    const defaults: RecordImportWizard[] = []

    for (const w of wizards) {
      const type = w?.redirectUriMetadata?.type || 'Default'
      if (type === 'Certified') {
        certified.push(w)
      } else if (type === 'Featured') {
        featured.push(w)
      } else {
        defaults.push(w)
      }
    }

    const sortByIndexThenName = (a: RecordImportWizard, b: RecordImportWizard) => {
      const ai = a?.redirectUriMetadata?.index ?? Number.POSITIVE_INFINITY
      const bi = b?.redirectUriMetadata?.index ?? Number.POSITIVE_INFINITY
      if (ai !== bi) return ai - bi
      return (a?.name || '').localeCompare(b?.name || '')
    }

    const sortByName = (a: RecordImportWizard, b: RecordImportWizard) =>
      (a?.name || '').localeCompare(b?.name || '')

    this.certifiedWizards = certified.sort(sortByIndexThenName)
    this.featuredWizards = featured.sort(sortByIndexThenName)
    this.defaultWizards = defaults.sort(sortByName)
  }

  openImportWizardUrlFilter(client: RecordImportWizard): string {
    if (client.status === 'RETIRED') {
      return client.clientWebsite
    } else {
      return (
        runtimeEnvironment.BASE_URL +
        'oauth/authorize' +
        '?client_id=' +
        client.id +
        '&response_type=code&scope=' +
        client.scopes +
        '&redirect_uri=' +
        client.redirectUri
      )
    }
  }

  toggle(recordImportWizard: RecordImportWizard) {
    recordImportWizard.show = !recordImportWizard.show
  }
}
