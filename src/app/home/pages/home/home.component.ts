import { Component, OnInit, Inject } from '@angular/core'
import { enterAnimation } from 'src/app/animations'
import { WINDOW } from '../../../cdk/window'

import { PlatformInfoService } from 'src/app/cdk/platform-info'
import { TogglzService } from 'src/app/core/togglz/togglz.service'
import { switchMap, tap } from 'rxjs/operators'
import { WordpressService } from 'src/app/core/wordpress/wordpress.service'
import { DomSanitizer, SafeHtml } from '@angular/platform-browser'
import { DOCUMENT } from '@angular/common'
import { EMPTY } from 'rxjs'

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
    standalone: false
})
export class HomeComponent implements OnInit {
  platform
  wordpressView!: SafeHtml
  notWordpressDisplay: boolean

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
      .getStateOf('WORDPRESS_HOME_PAGE')
      .pipe(
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
    return this.setupCss().pipe(
      switchMap(() => this.setupHtml()),
      switchMap(() => this.setupJs())
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
        const script = this.document.createElement('script')
        script.innerHTML = js
        this.document.body.appendChild(script)
      })
    )
  }

  setupHtml() {
    return this.wordpressService.getHomePagePost().pipe(
      tap((html) => {
        this.wordpressView = this.sanitizer.bypassSecurityTrustHtml(html)
        this.wordpressView
      })
    )
  }

  goto(url) {
    this.window.location.href = runtimeEnvironment.BASE_URL + url
  }

  ngOnInit() {}
}
