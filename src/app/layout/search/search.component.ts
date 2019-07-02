import { Component, OnInit, Inject, LOCALE_ID } from '@angular/core'
import { environment } from 'src/environments/environment'
import { FormBuilder, FormGroup } from '@angular/forms'

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  languageMenuOptions
  form: FormGroup
  constructor(@Inject(LOCALE_ID) public locale: string, fb: FormBuilder) {
    this.languageMenuOptions = environment.LANGUAGE_MENU_OPTIONS
    this.locale = 'en'
    this.form = fb.group({
      whereToSearch: 'REGISTRY',
    })
  }

  ngOnInit() {}

  changeLanguage(languageKey: string) {
    window.location.href = '/' + languageKey + '/'
  }
}
