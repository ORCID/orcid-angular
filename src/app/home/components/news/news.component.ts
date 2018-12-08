import { Component, OnInit } from '@angular/core'
import { BreakpointObserver } from '@angular/cdk/layout'
import { Breakpoints } from '@angular/cdk/layout'
import { NewsService } from '../../../core/news/news.service'
import { environment } from '../../../../environments/environment.sandbox'

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss'],
})
export class NewsComponent implements OnInit {
  constructor(private _news: NewsService) {}
  news

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
