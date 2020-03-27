import { Component, Inject, OnInit } from '@angular/core'
import { WINDOW } from '../../../cdk/window'
import { SignInService } from '../../../core/sign-in/sign-in.service'
import { MatIconRegistry } from '@angular/material'
import { DomSanitizer } from '@angular/platform-browser'

@Component({
  selector: 'app-social',
  templateUrl: './social.component.html',
  styleUrls: ['./social.component.scss'],
})
export class SocialComponent implements OnInit {
  submitted = false
  loading = false

  constructor(
    private _signIn: SignInService,
    @Inject(WINDOW) private window: Window,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
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
  }

  ngOnInit() {}

  onSubmit() {}

  navigateTo(val) {
    this.window.location.href = val
  }
}
