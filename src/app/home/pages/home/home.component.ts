import { Component, OnInit, Inject } from '@angular/core'
import { enterAnimation } from 'src/app/animations'
import { WINDOW } from '../../../cdk/window'
import { environment } from 'src/environments/environment'
import { PlatformInfoService } from 'src/app/cdk/platform-info'
import { TogglzService } from 'src/app/core/togglz/togglz.service'
import { switchMap } from 'rxjs/operators'
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
            return this.wordpressService.getHomePagePost()
          } else {
            return EMPTY
          }
        })
      )
      .subscribe((html) => {
        this.wordpressView = this.sanitizer.bypassSecurityTrustHtml(html)
      })
  }

  goto(url) {
    this.window.location.href = environment.BASE_URL + url
  }

  ngOnInit() {}
}
