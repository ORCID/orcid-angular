import { Component, Inject, OnInit } from '@angular/core'
import { WINDOW } from '../../../cdk/window'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { Observable } from 'rxjs'
import { map, startWith, take } from 'rxjs/operators'
import { DiscoService } from '../../../core/disco/disco.service'
import { InstitutionalService } from '../../../core/institutional/institutional.service'
import { Institutional } from '../../../types/institutional.endpoint'
import { CookieService } from 'ngx-cookie-service'

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
    private _cookie: CookieService,
    @Inject(WINDOW) private window: Window,
    private _disco: DiscoService,
    private _institutional: InstitutionalService
  ) {
    this._disco
      .getDiscoFeed()
      .pipe(take(1))
      .subscribe(
        (data) => {
          this.options = data
          this.clear()
        },
        (error) => {
          console.log('Error getting disco feed' + JSON.stringify(error))
        }
      )
  }

  ngOnInit() {}

  onSubmit() {
    // this._cookie.set(element.id, 'understood', 365)

    this._institutional
      .login(this.entityID)
      .pipe(take(1))
      .subscribe((data) => {
        console.log(JSON.stringify(data))
      })
  }

  private _filter(value: string): string[] {
    if (value === '' || value.length >= 3) {
      const filterValue = value.toLowerCase()

      if (value === '' && this.retrieveAllFiltered) {
        return this.retrieveAllFiltered
      } else if (value === '') {
        this.retrieveAllFiltered = this.options
          .filter((institution) =>
            institution.DisplayNames.some((displayNames) =>
              displayNames.value.toLowerCase().includes(filterValue)
            )
          )
          .map((result) => {
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
          .slice(0, 20)
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
    console.log(JSON.stringify(this.institution))
    this.entityID = this.institution.entityID
    if (this.institution.Logos) {
      this.logoInstitution = this.institution.Logos[0].value
    }
  }

  navigateTo(val) {
    this.window.location.href = val
  }
}
