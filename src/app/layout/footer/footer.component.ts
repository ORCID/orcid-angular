import { Component, OnInit, Inject } from '@angular/core'
import { PlatformInfoService } from 'src/app/cdk/platform-info'
import { WINDOW } from 'src/app/cdk/window'
import { environment } from '../../../environments/environment'

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
    @Inject(WINDOW) private window: Window
  ) {
    _platformInfo.get().subscribe((platformInfo) => {
      this.platform = platformInfo
    })
  }

  ngOnInit() {
    setTimeout(() => {
      const otBtn = this.window.document.getElementById('ot-sdk-btn')
      if (otBtn) {
        otBtn.innerText = $localize`:@@footer.cookieSettings:Cookie Settings`
      }
    }, 200)
  }

  goTo(url) {
    this.window.location.href = url
  }
}
