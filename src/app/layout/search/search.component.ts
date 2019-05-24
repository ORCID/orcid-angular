import { Component, OnInit, Inject, LOCALE_ID } from '@angular/core'
import { environment } from 'src/environments/environment'
import { FormBuilder, FormGroup } from '@angular/forms'
import { PlatformInfoService } from 'src/app/core'
import { PlatformInfo } from 'src/app/types'

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  languageMenuOptions
  form: FormGroup
  platform: PlatformInfo
  constructor(
    @Inject(LOCALE_ID) public locale: string,
    fb: FormBuilder,
    _platform: PlatformInfoService
  ) {
    this.languageMenuOptions = environment.LANGUAGE_MENU_OPTIONS
    this.locale = 'en'
    this.form = fb.group({
      whereToSearch: 'REGISTRY',
    })
    _platform.platformSubject.subscribe(data => {
      this.platform = data
    })
  }

  ngOnInit() {}

  changeLanguage(languageKey: string) {
    window.location.href = '/' + languageKey + '/'
  }
}
