import { Component, OnInit } from '@angular/core'

import { environment } from '../../../../environments/environment.sandbox'
import { NewsService } from 'src/app/core'
import { listAnimation } from 'src/app/animations'

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss'],
  animations: [listAnimation],
})
export class NewsComponent implements OnInit {
  news
  constructor(private _news: NewsService) {}

  ngOnInit() {
    this._news.getNews().subscribe(data => {
      this.news = data
    })
  }

  navigate(url) {
    window.location.href = url[0]
  }

  moreNews() {
    window.location.href = environment.BLOG_NEWS
  }
}
