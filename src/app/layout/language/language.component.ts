import { Component, OnInit, Inject, LOCALE_ID } from '@angular/core'
import { environment } from 'src/environments/environment'
import { WINDOW } from 'src/app/cdk/window'
import { CookieService } from 'ngx-cookie-service'

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
    private _cs: CookieService
  ) {
    this.languageMenuOptions = environment.LANGUAGE_MENU_OPTIONS
  }

  changeLanguage(languageKey: string) {
    if (environment.production) {
      this._cs.set('locale_v3', languageKey)
      this.window.location.reload()
    } else {
      this.window.location.href = '/' + languageKey + '/'
    }
  }
  ngOnInit() {}
}
