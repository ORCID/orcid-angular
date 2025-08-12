import { Component, ElementRef, Inject, Input } from '@angular/core'
import { WINDOW } from 'src/app/cdk/window'
import { RecordWorksService } from 'src/app/core/record-works/record-works.service'
import { Work } from 'src/app/types/record-works.endpoint'
import { LanguageMap } from 'src/app/types/works.endpoint'

@Component({
  selector: 'app-work-details',
  templateUrl: './work-details.component.html',
  styleUrls: ['./work-details.component.scss'],
  standalone: false,
})
export class WorkDetailsComponent {
  @Input() work: Work
  @Input() id: string
  @Input() isPublicRecord
  maxNumberContributors = 10
  maxNumberContributorsWorkDetails = 50
  maxBibtexCharacters = 5000
  showCitation = false
  showExpandedFormatting = false
  languageMap = LanguageMap
  privateName = 'Name is private'
  privateNameTranslation = $localize`:@@account.nameIsPri:Name is private`

  constructor(
    private elementRef: ElementRef,
    private _recordWorksService: RecordWorksService,
    @Inject(WINDOW) private window: Window
  ) {}

  getLanguageKey(val: String) {
    return Object.keys(LanguageMap).find((key) => LanguageMap[key] === val)
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
