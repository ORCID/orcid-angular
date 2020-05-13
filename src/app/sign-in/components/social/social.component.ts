import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core'
import { WINDOW } from '../../../cdk/window'
import { SignInService } from '../../../core/sign-in/sign-in.service'
import { MatIconRegistry } from '@angular/material/icon'
import { DomSanitizer } from '@angular/platform-browser'
import { PlatformInfo, PlatformInfoService } from '../../../cdk/platform-info'

@Component({
  selector: 'app-social',
  templateUrl: './social.component.html',
  styleUrls: ['./social.component.scss'],
})
export class SocialComponent implements OnInit {
  platform: PlatformInfo

  constructor(
    private _signIn: SignInService,
    @Inject(WINDOW) private window: Window,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    _platform: PlatformInfoService
  ) {
    this.matIconRegistry.addSvgIcon(
      `institutional-access`,
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../../../../assets/vectors/institutional-access.svg'
      )
    )

    this.matIconRegistry.addSvgIcon(
      `google`,
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../../../../assets/vectors/google.svg'
      )
    )

    this.matIconRegistry.addSvgIcon(
      `facebook`,
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../../../../assets/vectors/facebook.svg'
      )
    )

    _platform.get().subscribe((data) => {
      this.platform = data
    })
  }

  ngOnInit() {}

  navigateTo(val) {
    this.window.location.href = val
  }
}
