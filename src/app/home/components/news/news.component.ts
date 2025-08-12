import { Component, OnInit, Inject } from '@angular/core'
import { listAnimation } from 'src/app/animations'
import { NewsService } from 'src/app/core'

import { PlatformInfoService } from 'src/app/cdk/platform-info'
import { WINDOW } from 'src/app/cdk/window'

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss-theme.scss', './news.component.scss'],
  animations: [listAnimation],
  standalone: false,
})
export class NewsComponent implements OnInit {
  news
  platform
  labelHomeNews = $localize`:@@home.ariaLabelNews:News`
  constructor(
    private _news: NewsService,
    private _platform: PlatformInfoService,
    @Inject(WINDOW) private window: Window
  ) {
    _platform.platformSubject.subscribe((data) => {
      this.platform = data
    })
  }

  ngOnInit() {
    this._news.getNews().subscribe((data: any[]) => {
      this.news = data.slice(0, 3)
    })
  }

  navigate(url) {
    this.window.location.href = url[0]
  }

  moreNews() {
    this.window.location.href = runtimeEnvironment.INFO_SITE
  }
}
