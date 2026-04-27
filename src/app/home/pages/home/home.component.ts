import { Component, OnInit, Inject, DOCUMENT } from '@angular/core'
import { enterAnimation } from 'src/app/animations'
import { WINDOW } from '../../../cdk/window'

import { PlatformInfoService } from 'src/app/cdk/platform-info'
import { TogglzService } from 'src/app/core/togglz/togglz.service'
import { TogglzFlag } from 'src/app/types/config.endpoint'
import { switchMap, tap } from 'rxjs/operators'
import { WordpressService } from 'src/app/core/wordpress/wordpress.service'
import { DomSanitizer, SafeHtml } from '@angular/platform-browser'

import { EMPTY } from 'rxjs'
import { take } from 'rxjs/operators'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: [
    './home.component.scss-theme.scss',
    './home.component.scss',
    './wordpress-styles.scss',
  ],
  animations: [enterAnimation],
  preserveWhitespaces: true,
  standalone: false,
})
export class HomeComponent implements OnInit {
  platform
  wordpressView!: SafeHtml
  notWordpressDisplay: boolean
  private wordpressAssetsLoaded = false

  constructor(
    _platformInfo: PlatformInfoService,
    @Inject(WINDOW) private window: Window,
    private togglzService: TogglzService,
    private wordpressService: WordpressService,
    private sanitizer: DomSanitizer,
    @Inject(DOCUMENT) private document: Document
  ) {
    _platformInfo.get().subscribe((platformInfo) => {
      this.platform = platformInfo
    })
    this.togglzService
      .getStateOf(TogglzFlag.WORDPRESS_HOME_PAGE)
      .pipe(
        take(1),
        switchMap((state) => {
          this.notWordpressDisplay = !state
          if (state) {
            return this.setupHompage()
          } else {
            return EMPTY
          }
        })
      )
      .subscribe()
  }
  private setupHompage() {
    // Note: scripts inserted via [innerHTML] won't execute. We must load the
    // required CSS/JS via real DOM nodes.
    return this.setupCss().pipe(
      switchMap(() => this.setupHtml()),
      switchMap(() => this.setupJs()),
      switchMap(() => this.setupModulesJs())
    )
  }

  setupCss() {
    return this.wordpressService.getHomePageCSS().pipe(
      tap((css) => {
        const head = this.document.getElementsByTagName('head')[0]
        const style = this.document.createElement('style')
        style.innerHTML = css
        head.appendChild(style)
      })
    )
  }
  setupJs() {
    return this.wordpressService.getHomePageJS().pipe(
      tap((js) => {
        if (this.wordpressAssetsLoaded) return
        const script = this.document.createElement('script')
        script.innerHTML = js
        this.document.body.appendChild(script)
      })
    )
  }

  setupModulesJs() {
    return this.wordpressService.getHomePageModulesJS().pipe(
      tap((js) => {
        if (this.wordpressAssetsLoaded) return
        const script = this.document.createElement('script')
        script.type = 'module'
        script.innerHTML = js
        this.document.body.appendChild(script)
        this.wordpressAssetsLoaded = true
      })
    )
  }

  setupHtml() {
    return this.wordpressService.getHomePagePost().pipe(
      tap((html) => {
        // Parse and render only body content. Any <link>/<script> tags in the
        // fetched HTML would not execute when injected via [innerHTML] anyway.
        const parser = new DOMParser()
        const doc = parser.parseFromString(html, 'text/html')

        doc
          .querySelectorAll('script,link[rel="stylesheet"]')
          .forEach((n) => n.remove())

        this.wordpressView = this.sanitizer.bypassSecurityTrustHtml(
          doc.body?.innerHTML ?? html
        )
      })
    )
  }

  goto(url) {
    this.window.location.href = runtimeEnvironment.BASE_URL + url
  }

  ngOnInit() {}
}
