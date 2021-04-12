import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
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
}
