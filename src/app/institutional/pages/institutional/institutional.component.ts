import {
  Component,
  HostBinding,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { MatAutocompleteTrigger } from '@angular/material/autocomplete'
import { Router } from '@angular/router'
import { CookieService } from 'ngx-cookie-service'
import { Observable } from 'rxjs'
import { first, map, startWith, tap } from 'rxjs/operators'
import { PlatformInfoService } from 'src/app/cdk/platform-info'

import { environment } from '../../../../environments/environment'
import { WINDOW } from '../../../cdk/window'
import { DiscoService } from '../../../core/disco/disco.service'
import { InstitutionValidator } from '../../../shared/validators/institution/institution.validator'
import {
  DisplayName,
  Institutional,
} from '../../../types/institutional.endpoint'

@Component({
  selector: 'app-institutional',
  templateUrl: './institutional.component.html',
  styleUrls: ['./institutional.component.scss'],
  preserveWhitespaces: true,
})
export class InstitutionalComponent implements OnInit {
  @HostBinding('class.container') containerClass = true
  displayAutocompleteOptions = false
  loading = false
  options: string[]
  retrieveAllFiltered: any[]
  filteredOptions: Observable<string[]>
  institution: Institutional
  institutions: Institutional[]
  institutionsNames: string[]
  entityID: any
  logoInstitution: any
  cookieExpirationTime = 730
  userSelectedInstitutions = [] as Institutional[]
  labelInstitution = $localize`:@@institutional.ariaLabelInstitution:Institution`
  labelClear = $localize`:@@institutional.ariaLabelClear:Clear`
  @ViewChild(MatAutocompleteTrigger) autocomplete: MatAutocompleteTrigger

  institutionFormControl = new FormControl('', [Validators.required])

  institutionalForm = new FormGroup({
    institution: this.institutionFormControl,
  })

  constructor(
    @Inject(WINDOW) private window: Window,
    private _cookie: CookieService,
    private _disco: DiscoService,
    private _router: Router,
    private _platformInfo: PlatformInfoService
  ) {
    this.loading = true
    this._disco.getDiscoFeed().subscribe((res) => {
      this.loading = false
      this.institutions = res
      this.institutionsNames = this._disco.getInstitutionsNames(
        this.institutions
      )
      this.retrieveUserSelectedIdPs()
      this.institutionalForm.controls['institution'].setValidators([
        Validators.required,
        InstitutionValidator.valueSelected(this.institutionsNames),
      ])
      this.filteredOptions = this.institutionFormControl.valueChanges.pipe(
        startWith(''),
        map((filterInput) => {
          const institutionsFiltered = _disco.getInstitutionsNames(
            this.institutions,
            filterInput
          )
          return institutionsFiltered.length >
            environment.INSTITUTIONAL_AUTOCOMPLETE_DISPLAY_AMOUNT
            ? []
            : institutionsFiltered
        }),
        tap(() => {
          if (!this.institutionFormControl.valid) {
            this.logoInstitution = undefined
          }
        })
      )
      this.clear()
    })
  }

  back() {
    this._platformInfo
      .get()
      .pipe(first())
      .subscribe((platform) => {
        this._router.navigate(['/signin'], {
          queryParams: platform.queryParameters,
        })
      })
  }

  ngOnInit() {}

  onSubmit() {
    if (this.institutionalForm.valid || this.entityID) {
      this.loading = true

      this.addUserSelectedIdPs()
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

  clear() {
    this.logoInstitution = undefined
    this.institutionalForm.controls['institution'].setValue('')
  }

  selected(institutionName) {
    this.loading = true
    this.logoInstitution = undefined
    const institutionSelected = this._disco.getInstitutionBaseOnName(
      institutionName,
      this.institutions
    )

    this.loading = false
    this.institution = institutionSelected
    this.entityID = this.institution.entityID

    if (
      this.institution?.Logos &&
      !this.isInstitutionLogoDisplayed(this.institution.Logos[0].value)
    ) {
      this.logoInstitution = this.institution.Logos[0].value
    }
  }

  getNameInstitution(institution: Institutional): DisplayName {
    return institution.DisplayNames?.find((name) => name.lang === 'en')
  }

  addUserSelectedIdPs() {
    let dataCookie = this._cookie.get('_saml_idp')
    let institutions = []
    if (dataCookie) {
      dataCookie = dataCookie.replace(/^\s+|\s+$/g, '')
      dataCookie = dataCookie.replace('+', '%20')
      institutions = dataCookie.split('%20')
    }

    const dateCookie = new Date(
      new Date().getTime() + this.cookieExpirationTime * 24 * 60 * 60 * 1000
    )
    if (institutions.indexOf(btoa(this.entityID)) === -1) {
      if (institutions.length === 3) {
        institutions.shift()
      }
      institutions.push(btoa(this.entityID))
    }
    // Encode cookie base 64
    this._cookie.set(
      '_saml_institutional',
      institutions.join('%20'),
      dateCookie !== null ? dateCookie : this.cookieExpirationTime
    )
  }

  retrieveUserSelectedIdPs() {
    let cookieValues = this._cookie.get('_saml_institutional')
    if (cookieValues) {
      cookieValues = cookieValues.replace(/^\s+|\s+$/g, '')
      cookieValues = cookieValues.replace('+', '%20')
      const institutions = cookieValues.split('%20')
      for (const inst of institutions) {
        this._disco.getInstitutionBaseOnID(atob(inst)).subscribe((res) => {
          this.userSelectedInstitutions.push(res)
        })
      }
    }
  }

  selectInstitution(institution: Institutional) {
    this.entityID = institution.entityID
    this.onSubmit()
  }

  isInstitutionLogoDisplayed(logo): boolean {
    return this.userSelectedInstitutions.some((institution) =>
      institution?.Logos?.some((lo) => lo.value === logo)
    )
  }

  navigateTo(val) {
    this.window.location.href = val
  }
}
