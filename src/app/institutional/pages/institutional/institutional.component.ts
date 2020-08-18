import { Component, Inject, OnInit, ViewChild } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { MatAutocompleteTrigger } from '@angular/material/autocomplete'
import { CookieService } from 'ngx-cookie-service'
import { Observable } from 'rxjs'
import { map, switchMap, take, tap } from 'rxjs/operators'

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
    this._disco
      .getInstitutionsNames()
      .pipe(take(1))
      .subscribe((institutionsNames) => {
        this.loading = false
        this.institutionalForm.controls['institution'].setValidators([
          Validators.required,
          InstitutionValidator.valueSelected(institutionsNames),
        ])
        this.filteredOptions = this.institutionFormControl.valueChanges.pipe(
          switchMap((filterInput) =>
            this._disco.getInstitutionsNames(filterInput)
          ),
          map((institutions) =>
            institutions.length >
            environment.INSTITUTIONAL_AUTOCOMPLETE_DISPLAY_AMOUNT
              ? []
              : institutions
          ),
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
    this._disco
      .getInstitutionBaseOnName(institutionName)
      .subscribe((institution) => {
        this.loading = false
        this.institution = institution
        this.entityID = this.institution.entityID

        if (this.institution.Logos) {
          this.logoInstitution = this.institution.Logos[0].value
        }
      })
  }

  navigateTo(val) {
    this.window.location.href = val
  }
}
