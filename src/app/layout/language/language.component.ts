import { Component, OnInit, Inject, LOCALE_ID } from '@angular/core'
import { environment } from 'src/environments/environment'
import { WINDOW } from 'src/app/cdk/window'
import { CookieService } from 'ngx-cookie-service'
import { TogglzService } from 'src/app/core/togglz/togglz.service'
import { LanguageService } from 'src/app/core/language/language.service'

@Component({
  selector: 'app-language',
  templateUrl: './language.component.html',
  styleUrls: ['./language.component.scss'],
})
export class LanguageComponent implements OnInit {
  languageMenuOptions
  changeLanguageWithoutExtraBackendCallToggl = true
  constructor(
    @Inject(LOCALE_ID) public locale: string,
    @Inject(WINDOW) private window: Window,
    private _cs: CookieService,
    private _togglz: TogglzService,
    private _language: LanguageService
  ) {
    this.languageMenuOptions = environment.LANGUAGE_MENU_OPTIONS
    this._togglz
      .getStateOf('CHANGE_LANGUAGE_WITHOUT_EXTRA_BACKEND_CALL')
      .subscribe(
        value => (this.changeLanguageWithoutExtraBackendCallToggl = value)
      )
  }

  // If the togglz feature CHANGE_LANGUAGE_WITHOUT_EXTRA_BACKEND_CALL is enable
  // the cookie will be updated locally and the page will be reloaded
  // if not a backend call and the reload will be executed
  changeLanguage(languageKey: string) {
    if (this.changeLanguageWithoutExtraBackendCallToggl) {
      this._cs.set('locale_v3', languageKey, null, '/')
      this.window.location.reload()
    } else {
      this._language.changeLanguage(languageKey).subscribe(() => {
        this.window.location.reload()
      })
    }
  }

  ngOnInit() {}
}
