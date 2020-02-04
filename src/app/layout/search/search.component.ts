import { Component, OnInit, Inject } from '@angular/core'
import { FormGroup } from '@angular/forms'
import { WINDOW } from 'src/app/cdk/window'
import { LOCALE } from '../../../locale/messages.dynamic.en'
import { TogglzService } from 'src/app/core/togglz/togglz.service'
import { Config } from 'src/app/types/togglz.endpoint'
import { PlatformInfoService, PlatformInfo } from 'src/app/cdk/platform-info'

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss-theme.scss', './search.component.scss'],
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
  searchPlaceHolder = this.firstLetterUppercase(LOCALE['ngOrcid.search'])
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
      this.window.location.href =
        '/orcid-search/quick-search/?searchQuery=' + whatToSearch
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
