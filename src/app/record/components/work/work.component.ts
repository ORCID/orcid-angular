import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { OrgDisambiguated } from 'src/app/types'
import { Affiliation } from 'src/app/types/record-affiliation.endpoint'

@Component({
  selector: 'app-work',
  templateUrl: './work.component.html',
  styleUrls: ['./work.component.scss'],
})
export class WorkComponent implements OnInit {
  @Input() affiliation: Affiliation
  @Input() panelDetailsState: {
    detailShowData: boolean
    detailShowLoader: boolean
    state: boolean
  }
  @Output() toggleDetails = new EventEmitter<Affiliation>()
  @Input() stackMode
  @Input() orgDisambiguated: OrgDisambiguated

  constructor() {}

  ngOnInit(): void {}

  /**
   * RegEx function to check if the elements contains a URL
   */
  isUrl(element) {
    const expression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi
    const regex = new RegExp(expression)
    return element.match(regex)
  }
}
