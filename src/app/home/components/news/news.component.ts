import { Component, OnInit, Inject } from '@angular/core'
import { listAnimation } from 'src/app/animations'
import { NewsService, PlatformInfoService, WINDOW } from 'src/app/core'
import { environment } from 'src/environments/environment.sandbox'

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss-theme.scss', './news.component.scss'],
  animations: [listAnimation],
})
export class NewsComponent implements OnInit {
  news
  platform
  constructor(
    private _news: NewsService,
    private _platform: PlatformInfoService,
    @Inject(WINDOW) private window: Window
  ) {
    _platform.platformSubject.subscribe(data => {
      this.platform = data
    })
  }

  ngOnInit() {
    this._news.getNews().subscribe((data: Array<any>) => {
      this.news = data.slice(0, 3)
    })
  }

  navigate(url) {
    this.window.location.href = url[0]
  }

  moreNews() {
    this.window.location.href = environment.BLOG_NEWS
  }
}
