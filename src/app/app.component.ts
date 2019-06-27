import { Component, HostBinding } from '@angular/core'

import { PlatformInfoService } from './core/platform-info/platform-info.service'
import {
  ActivatedRoute,
  Router,
  RoutesRecognized,
  ActivationEnd,
  NavigationEnd,
  GuardsCheckStart,
  NavigationStart,
} from '@angular/router'
import { filter } from 'rxjs/operators'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  @HostBinding('class.edge') edge
  @HostBinding('class.ie') ie
  @HostBinding('class.tabletOrHandset') tabletOrHandset
  @HostBinding('class.handset') handset
  @HostBinding('class.tablet') tablet
  @HostBinding('class.desktop') desktop
  bootstrapLayout = false

  constructor(_platformInfo: PlatformInfoService, _router: Router) {
    _platformInfo.get().subscribe(platformInfo => {
      this.ie = platformInfo.ie
      this.edge = platformInfo.edge
      this.tabletOrHandset = platformInfo.tabletOrHandset
      this.handset = platformInfo.handset
      this.tablet = platformInfo.tablet
      this.desktop = platformInfo.desktop

      _router.events.pipe().subscribe(route => {
        if (route instanceof NavigationStart) {
          this.bootstrapLayout = route.url === '/bootstrap-home'
        }
      })
    })
  }
}
