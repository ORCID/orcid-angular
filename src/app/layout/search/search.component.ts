import { Component, OnInit, Inject } from '@angular/core'
import { FormGroup } from '@angular/forms'
import { PlatformInfoService, WINDOW } from 'src/app/core'
import { PlatformInfo } from 'src/app/types'
import { LOCALE } from '../../../locale/messages.dynamic.en'
import { TogglzService } from 'src/app/core/togglz/togglz.service'
import { Router } from '@angular/router'

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss-theme.scss', './search.component.scss'],
})
export class SearchComponent implements OnInit {
  form: FormGroup
  platform: PlatformInfo
  togglzEnableUserMenu: boolean
  togglzOrcidAngularSearch: boolean
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
    _togglz: TogglzService,
    private router: Router
  ) {
    _platform.platformSubject.subscribe(data => {
      this.platform = data
    })
    _togglz
      .getStateOf('ENABLE_USER_MENU')
      .subscribe(value => (this.togglzEnableUserMenu = value))
    _togglz
      .getStateOf('ORCID_ANGULAR_SEARCH')
      .subscribe(value => (this.togglzOrcidAngularSearch = value))
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
      if (!this.togglzOrcidAngularSearch) {
        // navigate directly the window location
        this.window.location.href =
          '/orcid-search/quick-search/?searchQuery=' + whatToSearch
      } else {
        // navigate using the angular router to never leave the Angular app
        this.router.navigate(['/orcid-search/search'], {
          queryParams: { searchQuery: whatToSearch },
        })
      }
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
