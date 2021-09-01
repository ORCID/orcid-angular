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

  disallowRobots() {
    return this.meta.updateTag({
      name: this.robots,
      content: 'noindex, nofollow',
    })
  }
  restoreEnvironmentRobotsConfig() {
    if (environment.ROBOTS) {
      this.meta.updateTag({ name: this.robots, content: environment.ROBOTS })
    } else {
      // If not defined by the environment do not allow robots
      this.meta.updateTag({
        name: this.robots,
        content: 'noindex, nofollow',
      })
    }
  }
}
