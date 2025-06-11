import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core'
import { ActivatedRoute, Router, UrlTree } from '@angular/router'
import { Subject } from 'rxjs'
import { PlatformInfo, PlatformInfoService } from 'src/app/cdk/platform-info'
import { WINDOW } from 'src/app/cdk/window'
import { ApplicationRoutes } from 'src/app/constants'

@Component({
  selector: 'app-self-service',
  templateUrl: './self-service.component.html',
  styleUrls: [
    './self-service.component.scss',
    './self-service.component.scss-theme.scss',
  ],
  preserveWhitespaces: true,
})
export class SelfServiceComponent implements OnInit {
  @Output() loading = new EventEmitter<boolean>()
  $destroy = new Subject<void>()
  isMobile: boolean
  platform: PlatformInfo

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _platform: PlatformInfoService,
    @Inject(WINDOW) private _window: Window
  ) {}

  ngOnInit(): void {
    this._platform.get().subscribe((platform) => {
      this.platform = platform
      this.isMobile = platform.columns4 || platform.columns8
    })
  }

  ngOnDestroy(): void {
    this.$destroy.next()
    this.$destroy.complete()
  }
}
