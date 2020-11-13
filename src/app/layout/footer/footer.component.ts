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
  togglzNewInfoSite: boolean

  constructor(
    _platformInfo: PlatformInfoService,
    @Inject(WINDOW) private window: Window,
    _togglz: TogglzService
  ) {
    _platformInfo.get().subscribe((platformInfo) => {
      this.platform = platformInfo
    })
    _togglz
      .getStateOf('NEW_INFO_SITE')
      .subscribe((value) => (this.togglzNewInfoSite = value))
  }

  ngOnInit() {}

  goTo(url) {
    this.window.location.href = url
  }

  privacyPolicy() {
    !this.togglzNewInfoSite
      ? this.goTo('/footer/privacy-policy')
      : this.goTo(`${environment.INFO_SITE}/privacy-policy/`)
  }

  termsOfUse() {
    !this.togglzNewInfoSite
      ? this.goTo('/content/orcid-terms-use')
      : this.goTo(`${environment.INFO_SITE}/terms-of-use/`)
  }
  accessibilityStatement() {
    !this.togglzNewInfoSite
      ? this.goTo('/content/orcid-accessibility-statement')
      : this.goTo(`${environment.INFO_SITE}/accessibility-statement/`)
  }

  contactUs() {
    this.goTo('https://support.orcid.org/hc/en-us/requests/new')
  }

  disputeProcedures() {
    !this.togglzNewInfoSite
      ? this.goTo('/orcid-dispute-procedures')
      : this.goTo(`${environment.INFO_SITE}/dispute-procedures/`)
  }

  brandGuidelines() {
    !this.togglzNewInfoSite
      ? this.goTo('/trademark-and-id-display-guidelines')
      : this.goTo(`${environment.INFO_SITE}/trademark-and-id-display-guidelines//`)
  }
}
  