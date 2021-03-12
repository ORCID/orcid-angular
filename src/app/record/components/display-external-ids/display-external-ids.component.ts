import { Component, Input, OnInit } from '@angular/core'
import { ExternalIdentifier } from 'src/app/types/common.endpoint'

@Component({
  selector: 'app-display-external-ids',
  templateUrl: './display-external-ids.component.html',
  styleUrls: ['./display-external-ids.component.scss'],
})
export class DisplayExternalIdsComponent implements OnInit {
  @Input() externalIdentifiers: ExternalIdentifier[]

  constructor() {}

  ngOnInit(): void {}
}
