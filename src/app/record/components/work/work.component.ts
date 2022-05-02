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

  constructor(
    private elementRef: ElementRef,
    private _userInfo: UserInfoService,
    private _recordWorksService: RecordWorksService,
    @Inject(WINDOW) private window: Window
  ) {}

  ngOnInit(): void {
    this.contributorsGroupedByOrcid = this.work.contributorsGroupedByOrcid
    this.numberOfContributors = this.work.numberOfContributors
    if (this.contributorsGroupedByOrcid) {
      if (this.isPublicRecord) {
        this.getContributionRole(this.contributorsGroupedByOrcid)
      } else {
        this._userInfo.getUserInfo().subscribe((config) => {
          this.id = config.EFFECTIVE_USER_ORCID
          this.getContributionRole(this.contributorsGroupedByOrcid)
        })
      }
    }
  }

  /**
   * RegEx function to check if the elements contains a URL
   */
  isUrl(element): boolean {
    return RegExp(URL_REGEXP).test(element)
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

  getContributionRole(contributors: Contributor[]) {
    contributors.forEach((c) => {
      if (
        (this.isPublicRecord &&
          c?.contributorOrcid?.path === this.isPublicRecord) ||
        (this.id && c?.contributorOrcid?.path === this.id)
      ) {
        this.addRole(c)
      }
    })
  }

  addRole(contributor: Contributor) {
    contributor.rolesAndSequences.forEach((roleAndSequence) => {
      if (this.contributionRole) {
        this.contributionRole =
          this.contributionRole +
          ', ' +
          roleAndSequence?.contributorRole?.toLowerCase()
      } else {
        this.contributionRole = roleAndSequence?.contributorRole?.toLowerCase()
      }
    })
  }
}
