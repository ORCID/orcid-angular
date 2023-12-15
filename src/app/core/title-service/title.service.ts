import { Injectable, OnInit } from '@angular/core'
import { Title } from '@angular/platform-browser'
import { NavigationEnd, NavigationStart, Router } from '@angular/router'
import { ReplaySubject, combineLatest } from 'rxjs'
import { filter, map, withLatestFrom } from 'rxjs/operators'
import {
  ApplicationDynamicRoutesLabels,
  ApplicationRoutes,
  ApplicationRoutesLabels,
  ORCID_REGEXP,
} from 'src/app/constants'

@Injectable()
export class TitleService {
  private _displayName: ReplaySubject<string> = new ReplaySubject<string>(1)

  constructor(private _titleService: Title, private _router: Router) {}

  init() {
    this._displayName.next('')
    combineLatest([
      this._router.events.pipe(
        filter((event) => event instanceof NavigationEnd),
        map((event: NavigationEnd) => event as NavigationEnd)
      ),
      this._displayName.asObservable(),
    ]).subscribe(([event, dynamicTitle]) => {
      // PUBLIC PAGE
      if (
        !event?.url.startsWith('/my-orcid') &&
        ORCID_REGEXP.test(event?.url) &&
        dynamicTitle
      ) {
        this.setTitle(
          `${dynamicTitle} ${ApplicationDynamicRoutesLabels.orcidPageTitle}`
        )
      } else {
        Object.keys(ApplicationRoutesLabels).forEach((route) => {
          if (event.url.startsWith('/' + route)) {
            // MY ORCID
            if (dynamicTitle) {
              this.setTitle(
                `${dynamicTitle} ${ApplicationDynamicRoutesLabels.orcidMyPageTitle}`
              )
            } else {
              // OTHER PAGES
              this.setTitle(ApplicationRoutesLabels[route])
            }
          }
        })
      }
    })
  }

  setTitle(title: string) {
    if (title) this._titleService.setTitle(title.replace(/-'/g, '−'))
  }

  setDisplayName(displayedNameWithId: string) {
    this._displayName.next(displayedNameWithId)
  }
}
