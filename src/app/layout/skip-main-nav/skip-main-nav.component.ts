import { Component, OnInit, Inject, asNativeElements } from '@angular/core'
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router'
import { WINDOW } from 'src/app/cdk/window'
import { take, filter } from 'rxjs/operators'

@Component({
  selector: 'app-skip-main-nav',
  templateUrl: './skip-main-nav.component.html',
  styleUrls: ['./skip-main-nav.component.scss'],
})
export class SkipMainNavComponent implements OnInit {
  currentUrl: string
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    @Inject(WINDOW) private window: Window
  ) {
    router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((url: NavigationEnd) => {
        this.currentUrl = url.urlAfterRedirects.replace('#main', '')
      })
  }

  ngOnInit() {}

  skipMainMenu() {
    const content: HTMLDivElement = this.window.document.querySelector('#main')
    console.log(content.focus)

    if (content) {
      content.focus()
    }
  }
}
