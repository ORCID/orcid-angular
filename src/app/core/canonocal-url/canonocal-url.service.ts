import { Inject, Injectable, DOCUMENT } from '@angular/core'
import { NavigationEnd, Router } from '@angular/router'
import { filter, map } from 'rxjs/operators'
import { ORCID_REGEXP } from 'src/app/constants'

@Injectable({
  providedIn: 'root',
})
export class CanonocalUrlService {
  constructor(
    @Inject(DOCUMENT) private doc: any,
    private _router: Router
  ) {
    this.init()
  }

  private init() {
    this._router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map((event: NavigationEnd) => event as NavigationEnd)
      )
      .subscribe((event) => {
        if (
          event?.url.startsWith('/my-orcid') ||
          !ORCID_REGEXP.test(event?.url)
        ) {
          // Remove canonical url if the route is not public page
          this.removeCanonicalUrl()
        }
      })
  }

  setCanonicalUrl(publicOrcid) {
    // Just in case there is another canonical link already
    this.removeCanonicalUrl()
    let canonicalUrl =
      'https:' +
      runtimeEnvironment.BASE_URL +
      (runtimeEnvironment.BASE_URL.endsWith('/')
        ? publicOrcid
        : '/' + publicOrcid)
    let link: HTMLLinkElement = this.doc.createElement('link')

    link.setAttribute('rel', 'canonical')
    link.setAttribute('href', canonicalUrl)
    this.doc.head.appendChild(link)
  }
  removeCanonicalUrl() {
    this.doc.head.querySelectorAll('link').forEach((link) => {
      let attributeRel = link.getAttribute('rel')
      if (attributeRel && attributeRel == 'canonical') {
        link.parentNode.removeChild(link)
      }
    })
  }
}
