import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { URL_REGEXP } from 'src/app/constants'
import { OrgDisambiguated } from 'src/app/types'
import { Work } from 'src/app/types/record-works.endpoint'

@Component({
  selector: 'app-work',
  templateUrl: './work.component.html',
  styleUrls: ['./work.component.scss'],
  preserveWhitespaces: true,
})
export class WorkComponent implements OnInit {
  @Input() work: Work
  @Input() panelDetailsState: {
    state: boolean
  }
  @Output() toggleDetails = new EventEmitter<Work>()
  @Input() stackMode
  @Input() orgDisambiguated: OrgDisambiguated

  constructor() {}

  ngOnInit(): void {}
  /**
   * RegEx function to check if the elements contains a URL
   */
  isUrl(element) {
    return RegExp(URL_REGEXP).test(element)
  }
}
