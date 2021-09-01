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
  undefinedIdLabe = $localize`:@@share.undefinedId:undefined id`

  constructor() {}

  ngOnInit(): void {
    if (this.externalIdentifier) {
      this.externalIdentifiers = Array.of(this.externalIdentifier)
    }
  }
}
