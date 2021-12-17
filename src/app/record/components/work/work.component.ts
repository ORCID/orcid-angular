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
  maxNumberContributors = 10
  maxNumberContributorsWorkDetails = 50
  maxBibtexCharacters = 1000
  contributors: string[] = []
  numberOfContributors: number
  contributorsDetails: Contributor[] = []

  constructor(
    private elementRef: ElementRef,
    private _recordWorksService: RecordWorksService,
    @Inject(WINDOW) private window: Window
  ) {}

  ngOnInit(): void {
    this.getContributors(this.work.contributors)
    this.getContributorsDetails(this.work.contributors)
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

  getContributors(contributor: Contributor[]) {
    contributor.forEach((c) => {
      if (c?.creditName?.value) {
        if (!this.contributors.includes(c?.creditName?.value)) {
          this.contributors.push(c?.creditName?.value)
        }
      }
    })
    this.numberOfContributors = this.contributors.length
  }

  getContributorsDetails(contributors: Contributor[]) {
    contributors.forEach((c) => {
      const contributor = this.contributorsDetails.some(
        (cD) => cD?.creditName?.value === c?.creditName?.value
      )
      if (contributor) {
        this.contributorsDetails.forEach((cD) => {
          if (cD?.creditName?.value === c?.creditName?.value) {
            if (c.contributorRole?.value || c.contributorSequence?.value) {
              cD.contributorRolesAndSequence.push({
                role: c.contributorRole?.value,
                sequence: c.contributorSequence?.value,
              })
            }
          }
        })
      } else {
        if (c.contributorRole?.value || c.contributorSequence?.value) {
          c.contributorRolesAndSequence = [
            {
              role: c.contributorRole?.value,
              sequence: c.contributorSequence?.value,
            },
          ]
        }
        this.contributorsDetails.push(c)
      }
    })
  }
}
