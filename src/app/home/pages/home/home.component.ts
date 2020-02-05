import { Component, OnInit, Inject } from '@angular/core'
import { enterAnimation } from 'src/app/animations'
import { WINDOW } from '../../../cdk/window'
import { environment } from 'src/environments/environment'
import { PlatformInfoService } from 'src/app/cdk/platform-info'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss-theme.scss', './home.component.scss'],
  animations: [enterAnimation],
  preserveWhitespaces: true,
})
export class HomeComponent implements OnInit {
  platform

  constructor(
    _platformInfo: PlatformInfoService,
    @Inject(WINDOW) private window: Window
  ) {
    _platformInfo.get().subscribe(platformInfo => {
      this.platform = platformInfo
    })
  }

  goto(url) {
    this.window.location.href = environment.BASE_URL + url
  }

  ngOnInit() {}
}
