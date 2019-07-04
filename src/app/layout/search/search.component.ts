import { Component, OnInit, Inject } from '@angular/core'
import { FormGroup } from '@angular/forms'
import { PlatformInfoService, WINDOW } from 'src/app/core'
import { PlatformInfo } from 'src/app/types'
import { LOCALE } from '../../../locale/messages.dynamic.en'
import { TogglzService } from 'src/app/core/togglz/togglz.service'
import { Config } from 'src/app/types/togglz.endpoint'

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  form: FormGroup
  platform: PlatformInfo
  togglz: Config
  whereToSearch = [
    this.firstLetterUppercase(LOCALE['layout.public-layout.registry']),
    this.firstLetterUppercase(LOCALE['layout.public-layout.website']),
  ]
  whereToSearchSelected = this.firstLetterUppercase(
    LOCALE['layout.public-layout.registry']
  )
  searchPlaceHolder = this.firstLetterUppercase(
    LOCALE['orcid_bio_search.btnsearch']
  )
  whatToSearch = ''
  constructor(
    @Inject(WINDOW) private window: Window,
    _platform: PlatformInfoService,
    _togglz: TogglzService
  ) {
    _platform.platformSubject.subscribe(data => {
      this.platform = data
    })
    _togglz.getTogglz().subscribe(data => {
      this.togglz = data
    })
  }

  changeWhereToSearch(item) {
    this.whereToSearchSelected = item
  }

  ngOnInit() {}

  search(whereToSearch, whatToSearch) {
    if (
      whereToSearch ===
      this.firstLetterUppercase(LOCALE['layout.public-layout.registry'])
    ) {
      this.window.location.href = '/orcid-search/quick-search/?' + whatToSearch
    } else {
      this.window.location.href = '/search/node/' + whatToSearch
    }
  }

  goTo(url) {
    this.window.location.href = url
  }

  firstLetterUppercase(string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
  }
}
