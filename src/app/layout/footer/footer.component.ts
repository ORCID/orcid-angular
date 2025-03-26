import { Component, OnInit, Inject } from '@angular/core'
import { PlatformInfoService } from 'src/app/cdk/platform-info'
import { WINDOW } from 'src/app/cdk/window'

import { RecordUtil } from 'src/app/shared/utils/record.util'

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss-theme.scss', './footer.component.scss'],
  preserveWhitespaces: true,
})
export class FooterComponent implements OnInit {
  platform
  labelFooter = $localize`:@@layout.ariaLabelFooter:footer`
  infoSiteBaseUrl = runtimeEnvironment.INFO_SITE
  isDesktop = false
  isTablet = false
  isMobile = false

  license = RecordUtil.appendOpensInNewTab(
    $localize`:@@footer.ariaLabelLicense:license`
  )
  linkedin = RecordUtil.appendOpensInNewTab('Linkedin')
  bluesky = RecordUtil.appendOpensInNewTab('Bluesky')
  facebook = RecordUtil.appendOpensInNewTab('Facebook')
  mastodon = RecordUtil.appendOpensInNewTab('Mastodon')
  vimeo = RecordUtil.appendOpensInNewTab('Vimeo')
  youtube = RecordUtil.appendOpensInNewTab('Youtube')
  rss = RecordUtil.appendOpensInNewTab('RSS')
  github = RecordUtil.appendOpensInNewTab('Github')
  twitter = RecordUtil.appendOpensInNewTab('Twitter')

  constructor(
    _platformInfo: PlatformInfoService,
    @Inject(WINDOW) private window: Window
  ) {
    _platformInfo.get().subscribe((platformInfo) => {
      this.platform = platformInfo
      this.isDesktop = platformInfo.columns12
      this.isTablet = platformInfo.columns8
      this.isMobile = platformInfo.columns4
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
