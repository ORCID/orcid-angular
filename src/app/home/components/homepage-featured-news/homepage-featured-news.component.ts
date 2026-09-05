import { Component, Input } from '@angular/core'
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser'

import { HomepageFeaturedNews } from 'src/app/types/homepage-content'
import { vimeoEmbedUrl } from '../../pipes/vimeo-embed-url'

@Component({
  selector: 'app-homepage-featured-news',
  templateUrl: './homepage-featured-news.component.html',
  styleUrls: ['./homepage-featured-news.component.scss'],
  standalone: false,
})
export class HomepageFeaturedNewsComponent {
  news?: HomepageFeaturedNews
  /**
   * Resolved once when the content arrives rather than by a pipe in the
   * template: an iframe's `src` is applied while the element is created, and a
   * value that only exists inside the structural directive's context does not
   * reach it in time.
   */
  videoUrl: SafeResourceUrl | null = null

  constructor(private sanitizer: DomSanitizer) {}

  @Input() set featuredNews(value: HomepageFeaturedNews | undefined) {
    this.news = value
    this.videoUrl = vimeoEmbedUrl(value?.vimeoId, this.sanitizer)
  }
}
