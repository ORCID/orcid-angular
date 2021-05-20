import { Injectable } from '@angular/core'
import { Meta } from '@angular/platform-browser'
import { environment } from 'src/environments/environment'

@Injectable({
  providedIn: 'root',
})
export class RobotsMetaTagsService {
  private google = 'googlebot'
  private robots = 'robots'
  private baiduSpider = 'BaiduSpider'

  constructor(private meta: Meta) {}

  addRobotMetaTags(): HTMLMetaElement[] {
    if (!environment.production) {
      return this.meta.addTags([
        { name: this.google, content: 'noindex' },
        {
          name: this.robots,
          content: 'noindex',
        },
        ,
        { name: this.baiduSpider, content: 'noindex' },
      ])
    }
  }
  removeRobotMetaTags() {
    this.meta.removeTag(`property="${this.google}"`)
    this.meta.removeTag(`property="${this.robots}"`)
    this.meta.removeTag(`property="${this.baiduSpider}"`)
  }
}
