import {
  Component,
  EventEmitter,
  Inject,
  LOCALE_ID,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core'
import { UntypedFormBuilder } from '@angular/forms'
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'
import { WINDOW } from 'src/app/cdk/window'
import { LanguageService } from 'src/app/core/language/language.service'

@Component({
    selector: 'app-settings-defaults-language',
    templateUrl: './settings-defaults-language.component.html',
    styleUrls: ['./settings-defaults-language.component.scss'],
    standalone: false
})
export class SettingsDefaultsLanguageComponent implements OnInit, OnDestroy {
  $destroy: Subject<boolean> = new Subject<boolean>()
  languageMenuOptions: { [key: string]: string }
  form: any
  @Output() loading = new EventEmitter<boolean>()

  constructor(
    @Inject(LOCALE_ID) public locale: string,
    @Inject(WINDOW) private window: Window,
    private _language: LanguageService,
    private _fb: UntypedFormBuilder
  ) {
    this.languageMenuOptions = runtimeEnvironment.LANGUAGE_MENU_OPTIONS
  }

  ngOnInit() {
    this.form = this._fb.group({
      locale:
        // LOCAL DEV GET'S `en-US` from locale but `en` is required
        this.locale === 'en-US' ? 'en' : this.locale,
    })
    this.form.controls.locale.valueChanges
      .pipe(takeUntil(this.$destroy))
      .subscribe((languageKey) => {
        this._language.changeLanguage(languageKey).subscribe(() => {
          this.window.location.reload()
        })
      })
  }

  ngOnDestroy() {
    this.$destroy.next(true)
    this.$destroy.unsubscribe()
  }
}
