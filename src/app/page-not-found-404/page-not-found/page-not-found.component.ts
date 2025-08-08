import { Component, OnDestroy, OnInit } from '@angular/core'
import { RobotsMetaTagsService } from 'src/app/core/robots-meta-tags/robots-meta-tags.service'

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.scss'],
  standalone: false,
})
export class PageNotFoundComponent implements OnInit, OnDestroy {
  constructor(private _robotsMetaTags: RobotsMetaTagsService) {}
  ngOnDestroy(): void {
    this._robotsMetaTags.restoreEnvironmentRobotsConfig()
  }
  ngOnInit(): void {
    this._robotsMetaTags.disallowRobots()
  }
}
