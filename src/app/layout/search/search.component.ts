import { Component, OnInit, Inject } from '@angular/core'
import { FormGroup } from '@angular/forms'
import { PlatformInfoService, WINDOW } from 'src/app/core'
import { PlatformInfo } from 'src/app/types'
import { LOCALE } from '../../../locale/messages.dynamic.en'

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  form: FormGroup
  platform: PlatformInfo
  whereToSearch = [
    LOCALE['layout.public-layout.registry'].toUpperCase(),
    LOCALE['layout.public-layout.website'].toUpperCase(),
  ]
  whereToSearchSelected = LOCALE['layout.public-layout.registry'].toUpperCase()
  searchPlaceHolder = LOCALE['orcid_bio_search.btnsearch']
  whatToSearch = ''
  constructor(
    @Inject(WINDOW) private window: Window,
    _platform: PlatformInfoService
  ) {
    _platform.platformSubject.subscribe(data => {
      this.platform = data
    })
  }

  changeWhereToSearch(item) {
    this.whereToSearchSelected = item
  }

  ngOnInit() {}

  search(whereToSearch, whatToSearch) {
    if (
      whereToSearch === LOCALE['layout.public-layout.registry'].toUpperCase()
    ) {
      this.window.location.href = '/orcid-search/quick-search/?' + whatToSearch
    } else {
      this.window.location.href = '/search/node/' + whatToSearch
    }
  }

  goTo(url) {
    this.window.location.href = url
  }
}
