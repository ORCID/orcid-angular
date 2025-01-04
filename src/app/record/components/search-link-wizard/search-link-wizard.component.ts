import { Component, Input, OnInit } from '@angular/core'
import { RecordImportWizard } from '../../../types/record-peer-review-import.endpoint'
import { environment } from '../../../../environments/environment'

@Component({
  selector: 'app-search-link-wizard',
  templateUrl: './search-link-wizard.component.html',
  styleUrls: ['./search-link-wizard.component.scss'],
})
export class SearchLinkWizardComponent implements OnInit {
  @Input() recordImportWizards: RecordImportWizard[]

  constructor() {}

  ngOnInit(): void {}

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
