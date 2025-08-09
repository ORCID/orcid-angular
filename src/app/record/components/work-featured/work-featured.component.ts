import {
  Component,
  HostBinding,
  Input,
  QueryList,
  ViewChildren,
} from '@angular/core'
import { RecordWorksService } from 'src/app/core/record-works/record-works.service'
import { VisibilityStrings } from 'src/app/types/common.endpoint'
import { Work } from 'src/app/types/record-works.endpoint'
import { UserRecord } from 'src/app/types/record.local'
import { PanelComponent } from '../../../cdk/panel/panel/panel.component'
import { UserInfo } from '../../../types'
import { WorkModalComponent } from '../work-modal/work-modal.component'

@Component({
  selector: 'app-work-featured',
  templateUrl: './work-featured.component.html',
  styleUrls: [
    './work-featured.component.scss',
    './work-featured.component.scss-theme.scss',
  ],
  standalone: false,
})
export class WorkFeaturedComponent {
  @Input() userRecord: UserRecord
  @Input() work: Work
  @Input() isPublicRecord: string

  @Input() userInfo: UserInfo
  @ViewChildren('panelsComponent') panelsComponent: QueryList<PanelComponent>

  panelDetailsState: {
    [key: string]: {
      state: boolean
    }
  } = {}

  constructor(private _workService: RecordWorksService) {}
}
