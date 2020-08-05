import { Component, Inject, OnInit, ViewChild } from '@angular/core'
import { WINDOW } from '../../../cdk/window'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { Observable, of } from 'rxjs'
import { map, startWith, take, switchMap, tap, filter } from 'rxjs/operators'
import { DiscoService } from '../../../core/disco/disco.service'
import { Institutional } from '../../../types/institutional.endpoint'
import { CookieService } from 'ngx-cookie-service'
import { environment } from '../../../../environments/environment'
import { InstitutionValidator } from '../../../shared/validators/institution/institution.validator'
import { MatAutocompleteTrigger } from '@angular/material/autocomplete'

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
    this._disco
      .getInstitutionsNames()
      .pipe(take(1))
      .subscribe(
        (institutionsNames) => {
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
            )
          )
          this.clear()
        },
        (error) => {
          // TODO @leomendoza123 display error using a toaster
          console.error('Error getting disco feed' + JSON.stringify(error))
        }
      )
  }

  ngOnInit() {}

  onSubmit() {
    if (this.institutionalForm.valid) {
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

  selected(institutionSelected) {
    this.logoInstitution = undefined
    // TODO GET THE ID BY NAME
    this.entityID = 'x'
    if (this.institution.Logos) {
      this.logoInstitution = this.institution.Logos[0].value
    }
  }

  navigateTo(val) {
    this.window.location.href = val
  }
}
