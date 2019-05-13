import { Component, OnInit } from '@angular/core'
import { listAnimation } from 'src/app/animations'
import { NewsService } from 'src/app/core'
import { environment } from 'src/environments/environment.sandbox'

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
    this._news.getNews().subscribe((data: Array<any>) => {
      this.news = data.slice(0, 3)
    })
  }

  navigate(url) {
    window.location.href = url[0]
  }

  moreNews() {
    window.location.href = environment.BLOG_NEWS
  }
}
