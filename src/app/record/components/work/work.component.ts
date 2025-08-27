import { Component, EventEmitter, Input, Output } from '@angular/core'
import { OrgDisambiguated } from 'src/app/types'
import { Work } from 'src/app/types/record-works.endpoint'

@Component({
  selector: 'app-work',
  templateUrl: './work.component.html',
  styleUrls: ['./work.component.scss'],
  preserveWhitespaces: true,
  standalone: false,
})
export class WorkComponent {
  @Input() work: Work
  @Input() panelDetailsState: {
    state: boolean
  }
  @Output() toggleDetails = new EventEmitter<Work>()
  @Input() stackMode
  @Input() orgDisambiguated: OrgDisambiguated
  @Input() id: string
  @Input() isPublicRecord
  @Input() featured: boolean = false
  maxNumberContributors = 10
  privateName = 'Name is private'
}
