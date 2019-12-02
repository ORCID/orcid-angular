import { Component, OnInit, Inject } from '@angular/core'
import { WINDOW } from 'src/app/core'
import { PlatformInfoService } from 'src/app/cdk/platform-info'

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss-theme.scss', './footer.component.scss'],
  preserveWhitespaces: true,
})
export class FooterComponent implements OnInit {
  platform

  constructor(
    _platformInfo: PlatformInfoService,
    @Inject(WINDOW) private window: Window
  ) {
    _platformInfo.get().subscribe(platformInfo => {
      this.platform = platformInfo
    })
  }

  ngOnInit() {}

  goTo(url) {
    this.window.location.href = url
  }
}
