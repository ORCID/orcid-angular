import { Component, OnInit } from '@angular/core'
import { NewsService } from 'src/app/core'
import { environment } from 'src/environments/environment.prod'
import { listAnimation } from 'src/app/animations'

@Component({
  selector: 'app-bootstrap-news',
  templateUrl: './bootstrap-news.component.html',
  styleUrls: ['./bootstrap-news.component.scss'],
  animations: [listAnimation],
})
export class BootstrapNewsComponent implements OnInit {
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
