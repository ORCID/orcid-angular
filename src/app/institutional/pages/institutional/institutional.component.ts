import { Component, Inject, OnInit } from '@angular/core'
import { WINDOW } from '../../../cdk/window'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { Observable } from 'rxjs'
import { map, startWith, take } from 'rxjs/operators'
import { DiscoService } from '../../../core/disco/disco.service'
import { Institutional } from '../../../types/institutional.endpoint'
import { CookieService } from 'ngx-cookie-service'
import { environment } from '../../../../environments/environment'
import { InstitutionValidator } from '../../../shared/validators/institution/institution.validator'
import { TypeSignIn } from '../../../types/sing-in.local'

@Component({
  selector: 'app-institutional',
  templateUrl: './institutional.component.html',
  styleUrls: ['./institutional.component.scss'],
  host: { class: 'container' },
  preserveWhitespaces: true,
})
export class InstitutionalComponent implements OnInit {
  loading = false
  options: any[]
  retrieveAllFiltered: any[]
  filteredOptions: Observable<string[]>
  institution: Institutional
  entityID: any
  logoInstitution: any

  institutionFormControl = new FormControl('', [Validators.required])

  institutitonalForm = new FormGroup({
    institution: this.institutionFormControl,
  })

  constructor(
    @Inject(WINDOW) private window: Window,
    private _cookie: CookieService,
    private _disco: DiscoService
  ) {
    this._disco
      .getDiscoFeed()
      .pipe(take(1))
      .subscribe(
        (data) => {
          this.options = data
          this.institutitonalForm.controls['institution'].setValidators([
            Validators.required,
            InstitutionValidator.valueSelected(this.options),
          ])
          this.clear()
        },
        (error) => {
          // TODO @leomendoza123 display error using a toaster
          console.log('Error getting disco feed' + JSON.stringify(error))
        }
      )
  }

  ngOnInit() {}

  onSubmit() {
    if (this.institutitonalForm.valid) {
      const defaultReturn =
        'https:' +
        environment.BASE_URL +
        'Shibboleth.sso/Login?SAMLDS=1&target=' +
        encodeURIComponent(
          'https:' + environment.BASE_URL + 'shibboleth/signin'
        )

      this.navigateTo(
        defaultReturn + '&entityID=' + encodeURIComponent(this.entityID)
      )
    }
  }

  private _filter(value: string): string[] {
    if (value === '' || value.length >= 3) {
      const filterValue = value.toLowerCase()

      if (value === '' && this.retrieveAllFiltered) {
        return this.retrieveAllFiltered
      } else if (value === '') {
        this.retrieveAllFiltered = this.options.map((result) => {
          return result.DisplayNames.filter(
            (subElement) => subElement.lang === 'en'
          ).map((en) => {
            return en.value
          })
        })
        return this.retrieveAllFiltered
      } else {
        return this.options
          .filter((institution) =>
            institution.DisplayNames.some((displayNames) =>
              displayNames.value.toLowerCase().includes(filterValue)
            )
          )
          .slice(0, environment.INSTITUTIONAL_AUTOCOMPLETE_DISPLAY_AMOUNT)
          .map((result) => {
            return result.DisplayNames.filter(
              (subElement) => subElement.lang === 'en'
            ).map((en) => {
              return en.value
            })
          })
      }
    }
  }

  clear() {
    this.logoInstitution = undefined
    this.institutitonalForm.controls['institution'].setValue('')
    this.filteredOptions = this.institutionFormControl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value))
    )
  }

  selected(institutionSelected) {
    this.logoInstitution = undefined
    this.institution = this.options.filter((institution) =>
      institution.DisplayNames.some(
        (displayNames) =>
          displayNames.value.toLowerCase() ===
          institutionSelected[0].toLowerCase()
      )
    )[0]
    this.entityID = this.institution.entityID
    if (this.institution.Logos) {
      this.logoInstitution = this.institution.Logos[0].value
    }
  }

  navigateTo(val) {
    this.window.location.href = val
  }
}
