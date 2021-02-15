import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop'
import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core'
import { FormControl, FormGroup } from '@angular/forms'
import { MatDialogRef } from '@angular/material/dialog'
import { MatSelect } from '@angular/material/select'
import { cloneDeep } from 'lodash'
import { Subject } from 'rxjs'
import { first, takeUntil } from 'rxjs/operators'
import { ModalComponent } from 'src/app/cdk/modal/modal/modal.component'
import { PlatformInfoService } from 'src/app/cdk/platform-info'
import { RecordCountriesService } from 'src/app/core/record-countries/record-countries.service'
import { VisibilityStrings } from 'src/app/types/common.endpoint'
import {
  Address,
  CountriesEndpoint,
  RecordCountryCodesEndpoint,
} from 'src/app/types/record-country.endpoint'

@Component({
  selector: 'app-modal-country',
  templateUrl: './modal-country.component.html',
  styleUrls: [
    './modal-country.component.scss-theme.scss',
    './modal-country.component.scss',
  ],
})
export class ModalCountryComponent implements OnInit, OnDestroy {
  $destroy: Subject<boolean> = new Subject<boolean>()

  constructor(
    public dialogRef: MatDialogRef<ModalComponent>,
    private _recordCountryService: RecordCountriesService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _platform: PlatformInfoService
  ) {}

  addedEmailsCount = 0
  countryForm: FormGroup
  countries: Address[]
  countriesMap: { [key: string]: Address }
  countryCodes: { key: string; value: string }[]
  originalCountryCodes: RecordCountryCodesEndpoint
  originalBackendCountries: CountriesEndpoint
  defaultVisibility: VisibilityStrings
  isMobile: boolean
  loadingCountries = true
  loadingCountryCodes = true
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
        this.loadingCountries = false
      })
    this._recordCountryService
      .getCountryCodes()
      .pipe(first())
      .subscribe((codes) => {
        this.originalCountryCodes = codes
        this.countryCodes = Object.entries(codes).map((keyValue) => {
          return { key: keyValue[0], value: keyValue[1] }
        })
        this.countryCodes.sort((a, b) => {
          if (a.key < b.key) {
            return -1
          }
          if (a.key > b.key) {
            return 1
          }
          return 0
        })
        this.loadingCountryCodes = false
      })
    this._platform
      .get()
      .pipe(takeUntil(this.$destroy))
      .subscribe(
        (platform) => (this.isMobile = platform.columns4 || platform.columns8)
      )
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
            putCode: key.indexOf('new-') === 0 ? null : key,
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
  }

  saveEvent() {
    this.loadingCountries = true
    this._recordCountryService
      .postAddresses(this.formToBackend(this.countryForm))
      .subscribe((response) => {
        console.log(response)
        this.closeEvent()
      })
  }
  closeEvent() {
    this.dialogRef.close()
  }
  drop(event: CdkDragDrop<string[]>) {
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
    let date: Date
    if (x.year && x.month && x.day) {
      date = new Date(
        Date.UTC(
          Number.parseInt(x.year, 10),
          Number.parseInt(x.month, 10),
          Number.parseInt(x.day, 10)
        )
      )
    }

    return date
  }

  ngOnDestroy() {
    this.$destroy.next(true)
    this.$destroy.unsubscribe()
  }
}
