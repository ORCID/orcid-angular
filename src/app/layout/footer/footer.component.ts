import { Component, OnInit, Inject } from '@angular/core'
import { PlatformInfoService } from 'src/app/cdk/platform-info'
import { WINDOW } from 'src/app/cdk/window'
import { environment } from '../../../environments/environment'
import { TogglzService } from '../../core/togglz/togglz.service'

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss-theme.scss', './footer.component.scss'],
  preserveWhitespaces: true,
})
export class FooterComponent implements OnInit {
  platform
  labelFooter = $localize`:@@layout.ariaLabelFooter:footer`
  infoSiteBaseUrl = environment.INFO_SITE

  constructor(
    _platformInfo: PlatformInfoService,
    @Inject(WINDOW) private window: Window,
    _togglz: TogglzService
  ) {
    _platformInfo.get().subscribe((platformInfo) => {
      this.platform = platformInfo
    })
  }

  ngOnInit() {}

  goTo(url) {
    this.window.location.href = url
  }
}
