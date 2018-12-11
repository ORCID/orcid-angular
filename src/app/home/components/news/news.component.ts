import { Component, OnInit } from '@angular/core'
import { BreakpointObserver } from '@angular/cdk/layout'
import { Breakpoints } from '@angular/cdk/layout'
import { NewsService } from '../../../core/news/news.service'
import { environment } from '../../../../environments/environment.sandbox'
import { trigger } from '@angular/animations'
import { transition } from '@angular/animations'
import { style } from '@angular/animations'
import { animate } from '@angular/animations'
import { stagger } from '@angular/animations'
import { query } from '@angular/animations'

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss'],
  animations: [
    trigger('listAnimation', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0 }),
          stagger(100, [animate('0.2s', style({ opacity: 1 }))]),
        ]),
      ]),
    ]),
  ],
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
