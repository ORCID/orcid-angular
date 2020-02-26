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
  constructor(
    @Inject(LOCALE_ID) public locale: string,
    @Inject(WINDOW) private window: Window,
    private _cs: CookieService,
    private _language: LanguageService
  ) {
    this.languageMenuOptions = environment.LANGUAGE_MENU_OPTIONS
  }

  // If the togglz feature CHANGE_LANGUAGE_WITHOUT_EXTRA_BACKEND_CALL is enable
  // the cookie will be updated locally and the page will be reloaded
  // if not a backend call and the reload will be executed
  changeLanguage(languageKey: string) {
    this._language.changeLanguage(languageKey).subscribe(() => {
      this.window.location.reload()
    })
  }

  ngOnInit() {}
}
