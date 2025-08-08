import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { OrgDisambiguated } from 'src/app/types'
import { Funding, LanguageMap } from 'src/app/types/record-funding.endpoint'

@Component({
  selector: 'app-funding',
  templateUrl: './funding.component.html',
  styleUrls: ['./funding.component.scss'],
  preserveWhitespaces: true,
  standalone: false,
})
export class FundingComponent implements OnInit {
  @Input() funding: Funding
  @Input() panelDetailsState: {
    state: boolean
  }
  @Output() toggleDetails = new EventEmitter<Funding>()
  @Input() stackMode
  @Input() orgDisambiguated: OrgDisambiguated

  constructor() {}

  ngOnInit(): void {}

  getLanguageValue(langCode: String) {
    for (const [key, value] of Object.entries(LanguageMap)) {
      if (langCode === key) {
        return value
      }
    }
    return ''
  }
}
