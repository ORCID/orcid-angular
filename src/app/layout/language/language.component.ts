import { Component, OnInit, Inject, LOCALE_ID } from '@angular/core'
import { environment } from 'src/environments/environment'
import { WINDOW } from 'src/app/cdk/window'
import { LanguageService } from 'src/app/core/language/language.service'

@Component({
  selector: 'app-language',
  templateUrl: './language.component.html',
  styleUrls: ['./language.component.scss'],
})
export class LanguageComponent implements OnInit {
  languageMenuOptions: { [key: string]: string }
  labelLanguage = $localize`:@@layout.ariaLabelLanguage:language`

  constructor(
    @Inject(LOCALE_ID) public locale: string,
    @Inject(WINDOW) private window: Window,
    private _language: LanguageService
  ) {
    this.languageMenuOptions = environment.LANGUAGE_MENU_OPTIONS
    // LOCAL DEV GET'S `en-US` from locale but `en` is required
    this.locale = this.locale === 'en-US' ? 'en' : this.locale
  }

  changeLanguage(languageKey: string) {
    this._language.changeLanguage(languageKey).subscribe(() => {
      this.window.location.reload()
    })
  }

  ngOnInit() {}
}
