import { Component, OnInit, Inject, LOCALE_ID } from '@angular/core'
import { environment } from 'src/environments/environment'
import { WINDOW } from 'src/app/core'

@Component({
  selector: 'app-language',
  templateUrl: './language.component.html',
  styleUrls: ['./language.component.scss'],
})
export class LanguageComponent implements OnInit {
  languageMenuOptions
  constructor(
    @Inject(LOCALE_ID) public locale: string,
    @Inject(WINDOW) private window: Window
  ) {
    this.languageMenuOptions = environment.LANGUAGE_MENU_OPTIONS
  }

  changeLanguage(languageKey: string) {
    this.window.location.href = '/' + languageKey + '/'
  }
  ngOnInit() {}
}
