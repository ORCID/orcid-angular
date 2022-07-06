import {
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Output,
} from '@angular/core'
import { URL_REGEXP } from 'src/app/constants'
import { Contributor, OrgDisambiguated } from 'src/app/types'
import { Work } from 'src/app/types/record-works.endpoint'
import { RecordWorksService } from '../../../core/record-works/record-works.service'
import { WINDOW } from '../../../cdk/window'
import { UserInfoService } from '../../../core/user-info/user-info.service'

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
  @Input() id: string
  @Input() isPublicRecord
  @Input() togglzWorksContributors: boolean
  maxNumberContributors = 10
  maxNumberContributorsWorkDetails = 50
  maxBibtexCharacters = 5000
  contributorsGroupedByOrcid: Contributor[] = []
  numberOfContributors: number
  contributionRole: string
  showCitation = false
  showExpandedFormatting = false
  privateName = 'Name is private'
  privateNameTranslation = $localize`:@@account.nameIsPri:Name is private`

  constructor(
    private elementRef: ElementRef,
    private _userInfo: UserInfoService,
    private _recordWorksService: RecordWorksService,
    @Inject(WINDOW) private window: Window
  ) {}

  ngOnInit(): void {
    this.contributorsGroupedByOrcid = this.work?.contributorsGroupedByOrcid
    this.numberOfContributors = this.work?.numberOfContributors
  }

  exportWork(work: Work) {
    this._recordWorksService
      .exportSelected([work.putCode.value])
      .subscribe((data) => {
        this.createTxtFile(data)
      })
  }

  createTxtFile(data) {
    if ((this.window.navigator as any)?.msSaveOrOpenBlob) {
      const fileData = [data]
      const blobObject = new Blob(fileData, { type: 'text/plain' })
      ;(this.window.navigator as any).msSaveOrOpenBlob(blobObject, 'works.bib')
    } else {
      const anchor = document.createElement('a')
      anchor.setAttribute('css', "{display: 'none'}")
      this.elementRef.nativeElement.append(anchor)
      anchor.setAttribute(
        'href',
        'data:text/x-bibtex;charset=utf-8,' + encodeURIComponent(data)
      )
      anchor.setAttribute('target', '_self')
      anchor.setAttribute('download', 'works.bib')
      anchor.click()
      anchor.remove()
    }
  }
}
