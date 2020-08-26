import { Component, Inject, OnInit, ViewChild } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { MatAutocompleteTrigger } from '@angular/material/autocomplete'
import { CookieService } from 'ngx-cookie-service'
import { Observable } from 'rxjs'
import { first, map, startWith, switchMap, take, tap } from 'rxjs/operators'

import { environment } from '../../../../environments/environment'
import { WINDOW } from '../../../cdk/window'
import { DiscoService } from '../../../core/disco/disco.service'
import { InstitutionValidator } from '../../../shared/validators/institution/institution.validator'
import { Institutional } from '../../../types/institutional.endpoint'

@Component({
  selector: 'app-institutional',
  templateUrl: './institutional.component.html',
  styleUrls: ['./institutional.component.scss'],
  host: { class: 'container' },
  preserveWhitespaces: true,
})
export class InstitutionalComponent implements OnInit {
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
    private _disco: DiscoService
  ) {
    this.loading = true
    this._disco.getDiscoFeed().subscribe((res) => {
      this.loading = false
      this.institutions = res
      this.institutionsNames = this._disco.getInstitutionsNames(
        this.institutions
      )
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

  ngOnInit() {}

  onSubmit() {
    if (this.institutionalForm.valid) {
      this.loading = true
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

    if (this.institution.Logos) {
      this.logoInstitution = this.institution.Logos[0].value
    }
  }

  navigateTo(val) {
    this.window.location.href = val
  }
}
