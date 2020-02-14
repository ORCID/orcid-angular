import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core'
import { FormGroup } from '@angular/forms'
import { WINDOW } from 'src/app/cdk/window'
import { LOCALE } from '../../../locale/messages.dynamic.en'
import { TogglzService } from 'src/app/core/togglz/togglz.service'
import { Router, ActivatedRoute } from '@angular/router'
import { PlatformInfoService, PlatformInfo } from 'src/app/cdk/platform-info'

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
  whatToSearch: string
  constructor(
    @Inject(WINDOW) private window: Window,
    _platform: PlatformInfoService,
    _togglz: TogglzService,
    private router: Router,
    private route: ActivatedRoute,
    public _changeDetection: ChangeDetectorRef
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

    this.route.queryParams.subscribe(value => this.setWhatToSearch(value))
  }

  changeWhereToSearch(item) {
    this.whereToSearchSelected = item
  }

  setWhatToSearch(queryParams) {
    // Set the whatToSearch when it comes on the query parameters
    if (Object.keys(queryParams).length && queryParams['searchQuery']) {
      this.whatToSearch = queryParams['searchQuery']
    } else {
      // Clean whatToSearch if is and advance search or has no query parameters
      this.whatToSearch = ''
    }
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
