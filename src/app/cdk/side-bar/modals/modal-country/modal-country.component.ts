import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop'
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core'
import { FormControl, FormGroup } from '@angular/forms'
import { MatDialogRef } from '@angular/material/dialog'
import { ModalComponent } from 'src/app/cdk/modal/modal/modal.component'
import { RecordCountriesService } from 'src/app/core/record-countries/record-countries.service'
import {
  Address,
  CountriesEndpoint,
  RecordCountryCodesEndpoint,
} from 'src/app/types/record-country.endpoint'
import { cloneDeep } from 'lodash'
import { first } from 'rxjs/operators'
import { VisibilityStrings } from 'src/app/types/common.endpoint'
import { MatSelect } from '@angular/material/select'
@Component({
  selector: 'app-modal-country',
  templateUrl: './modal-country.component.html',
  styleUrls: [
    './modal-country.component.scss-theme.scss',
    './modal-country.component.scss',
  ],
})
export class ModalCountryComponent implements OnInit, OnDestroy {
  constructor(
    public dialogRef: MatDialogRef<ModalComponent>,
    private _recordCountryService: RecordCountriesService,
    private _changeDetectorRef: ChangeDetectorRef
  ) {}

  addedEmailsCount = 0
  countryForm: FormGroup
  countries: Address[]
  countriesMap: { [key: string]: Address }
  countryCodes: { key: string; value: string }[]
  originalCountryCodes: RecordCountryCodesEndpoint
  originalBackendCountries: CountriesEndpoint
  defaultVisibility: VisibilityStrings
  @ViewChildren('countrySelect') inputs: QueryList<MatSelect>

  ngOnInit(): void {
    this._recordCountryService
      .getAddresses()
      .pipe(first())
      .subscribe((countries: CountriesEndpoint) => {
        this.defaultVisibility = countries.visibility.visibility
        this.originalBackendCountries = cloneDeep(countries)
        this.countries = this.originalBackendCountries.addresses
        this.countriesMap = {}
        this.originalBackendCountries.addresses.map(
          (value) => (this.countriesMap[value.putCode] = value)
        )

        this.backendJsonToForm(this.originalBackendCountries)
      })
    this._recordCountryService
      .getCountryCodes()
      .pipe(first())
      .subscribe((codes) => {
        this.originalCountryCodes = codes
        this.countryCodes = Object.entries(codes).map((keyValue) => {
          return { key: keyValue[0], value: keyValue[1] }
        })
      })
  }
  ngOnDestroy(): void {
    console.log('DESTROY!')
  }

  backendJsonToForm(emailEndpointJson: CountriesEndpoint) {
    const countries = emailEndpointJson.addresses
    const group: { [key: string]: FormGroup } = {}

    countries.forEach((country) => {
      group[country.putCode] = new FormGroup({
        country: new FormControl(country.countryName),
        visibility: new FormControl(country.visibility.visibility, {}),
      })
    })
    this.countryForm = new FormGroup(group)
    console.log(group)
  }

  formToBackend(countryForm: FormGroup): CountriesEndpoint {
    const countries: CountriesEndpoint = {
      errors: [],
      addresses: [],
      visibility: this.originalBackendCountries.visibility,
    }
    this.countries.reverse()
    this.countries
      .map((value) => value.putCode)
      // Clear empty inputs
      .filter((key) => countryForm.value[key].country)
      .forEach((key, i) => {
        const countryName = countryForm.value[key].country
        const visibility = countryForm.value[key].visibility
        if (countryForm.value[key]) {
          countries.addresses.push({
            putCode: key.indexOf('new-') == 0 ? null : key,
            countryName,
            iso2Country: {
              value: this.originalCountryCodes[countryName],
            },
            displayIndex: i + 1,
            visibility: {
              visibility,
            },
          } as Address)
        }
      })
    return countries

    //  const i = this.countries.findIndex((value) => value.putCode === putcode)
  }

  saveEvent() {
    this._recordCountryService
      .postAddresses(this.formToBackend(this.countryForm))
      .subscribe((response) => {
        console.log(response)
      })

    this.closeEvent()
  }
  closeEvent() {
    this.dialogRef.close()
  }
  drop(event: CdkDragDrop<string[]>) {
    console.log(event)
    moveItemInArray(this.countries, event.previousIndex, event.currentIndex)
  }
  addCountry() {
    this.countryForm.addControl(
      'new-' + this.addedEmailsCount,
      new FormGroup({
        country: new FormControl(),
        visibility: new FormControl(this.defaultVisibility, {}),
      })
    )
    this.countries.push({
      putCode: 'new-' + this.addedEmailsCount,
      visibility: { visibility: this.defaultVisibility },
    } as Address)
    this.addedEmailsCount++

    this._changeDetectorRef.detectChanges()
    const input = this.inputs.last
    input.focus()
  }
  deleteEmail(putcode: string) {
    const i = this.countries.findIndex((value) => value.putCode === putcode)
    this.countries.splice(i, 1)
    this.countryForm.removeControl(putcode)
  }

  getSourceName(address: Address) {
    return address.sourceName || address.source
  }

  getDate(address: Address) {
    const x = address.createdDate
    const date = new Date()
    if (x.year) {
      date.setFullYear(Number.parseInt(x.year, 10))
    }
    if (x.month) {
      date.setMonth(Number.parseInt(x.month, 10))
    }
    if (x.day) {
      date.setDate(Number.parseInt(x.day, 10))
    }
    return date
  }
}
