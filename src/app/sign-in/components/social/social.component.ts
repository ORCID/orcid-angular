import { Component, Inject, OnInit } from '@angular/core'
import { WINDOW } from '../../../cdk/window'
import { SignInService } from '../../../core/sign-in/sign-in.service'
import { PlatformInfo, PlatformInfoService } from '../../../cdk/platform-info'

@Component({
  selector: 'app-social',
  templateUrl: './social.component.html',
  styleUrls: ['./social.component.scss', './social.component.scss-theme.scss'],
})
export class SocialComponent implements OnInit {
  platform: PlatformInfo

  constructor(
    private _signIn: SignInService,
    @Inject(WINDOW) private window: Window,
    _platform: PlatformInfoService
  ) {
    _platform.get().subscribe((data) => {
      this.platform = data
    })
  }

  ngOnInit() {}

  navigateTo(val) {
    this.window.location.href = val
  }
}
