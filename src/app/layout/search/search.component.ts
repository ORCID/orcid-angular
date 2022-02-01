import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core'
import { FormGroup } from '@angular/forms'
import { WINDOW } from 'src/app/cdk/window'
import { TogglzService } from 'src/app/core/togglz/togglz.service'
import { Router, ActivatedRoute } from '@angular/router'
import { PlatformInfoService, PlatformInfo } from 'src/app/cdk/platform-info'
import { SearchService } from 'src/app/core/search/search.service'
import { Location } from '@angular/common'
import { ApplicationRoutes } from '../../constants'

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss-theme.scss', './search.component.scss'],
})
export class SearchComponent implements OnInit {
  labelSearch = $localize`:@@layout.ariaLabelSearch:Search`
  form: FormGroup
  platform: PlatformInfo
  togglzEnableUserMenu: boolean
  togglzOrcidAngularSearch: boolean
  signinRegisterButton = true
  whereToSearch = [
    this.firstLetterUppercase(
      $localize`:@@layout.public-layout.registry:registry`
    ),
    this.firstLetterUppercase(
      $localize`:@@layout.public-layout.website:website`
    ),
  ]
  whereToSearchSelected = this.firstLetterUppercase(
    $localize`:@@layout.public-layout.registry:registry`
  )
  searchPlaceHolder = this.firstLetterUppercase(
    $localize`:@@ngOrcid.search:Search...`
  )
  whatToSearch: string
  constructor(
    @Inject(WINDOW) private window: Window,
    private _search: SearchService,
    private _platform: PlatformInfoService,
    private _togglz: TogglzService,
    private router: Router,
    private route: ActivatedRoute,
    public _changeDetection: ChangeDetectorRef,
    private location: Location
  ) {}

  changeWhereToSearch(item) {
    this.whereToSearchSelected = item
  }

  setWhatToSearch(queryParams) {
    // Set the whatToSearch when it comes on the query parameters
    if (Object.keys(queryParams).length && queryParams['searchQuery']) {
      this.whatToSearch = queryParams['searchQuery']
    } else {
      // Clean whatToSearch if is and advanced search or has no query parameters
      this.whatToSearch = ''
    }
  }

  ngOnInit() {
    this._platform.platformSubject.subscribe((data) => {
      this.platform = data
    })
    this._togglz
      .getStateOf('ENABLE_USER_MENU')
      .subscribe((value) => (this.togglzEnableUserMenu = value))
    this._togglz
      .getStateOf('ORCID_ANGULAR_SEARCH')
      .subscribe((value) => (this.togglzOrcidAngularSearch = value))

    this.router.events.subscribe(
      () =>
        (this.signinRegisterButton =
          this.location.path() !== `/${ApplicationRoutes.signin}`)
    )
  }

  search(whereToSearch, whatToSearch) {
    if (
      whereToSearch ===
      this.firstLetterUppercase(
        $localize`:@@layout.public-layout.registry:registry`
      )
    ) {
      if (!this.togglzOrcidAngularSearch) {
        // navigate directly the window location
        this.window.location.href =
          '/orcid-search/quick-search/?searchQuery=' + whatToSearch
      } else {
        // navigate using the angular router to never leave the Angular app
        this.router.navigate(['/orcid-search/search'], {
          queryParams: {
            searchQuery: whatToSearch.trim(),
          },
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
