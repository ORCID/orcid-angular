import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop'
import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core'
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms'
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
  ariaLabelSave = $localize`:@@side-bar.ariaLabelCountrySave:Save changes to Countries`
  ariaLabelCancel = $localize`:@@side-bar.ariaLabelCountryCancel:Cancel changes and close Countries`
  ariaLabelDelete = $localize`:@@side-bar.ariaLabelCountryDelete:Delete Country or location`
  ariaLabelSelect = $localize`:@@side-bar.ariaLabelCountrySelect:Select country or location`
  ariaLabelClose = $localize`:@@side-bar.ariaLabelCountryClose:Close Countries`

  $destroy: Subject<boolean> = new Subject<boolean>()

  constructor(
    public dialogRef: MatDialogRef<ModalComponent>,
    private _recordCountryService: RecordCountriesService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _platform: PlatformInfoService
  ) {}

  id: string
  addedEmailsCount = 0
  countryForm: UntypedFormGroup
  countries: Address[]
  countriesMap: { [key: string]: Address }
  countryCodes: { key: string; value: string }[]
  originalBackendCountries: CountriesEndpoint
  defaultVisibility: VisibilityStrings
  isMobile: boolean
  screenDirection: 'rtl' | 'ltr'
  loadingCountries = true
  loadingCountryCodes = true
  @ViewChildren('countrySelect') inputs: QueryList<MatSelect>

  ngOrcidCountry = $localize`:@@shared.selectACountryOrLocation:Select a country or location`
  countryOrLocationLabel = $localize`:@@shared.countryOrLocation:Country or location`

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
        this.countryCodes = codes
        this.loadingCountryCodes = false
      })
    this._platform
      .get()
      .pipe(takeUntil(this.$destroy))
      .subscribe((platform) => {
        this.isMobile = platform.columns4 || platform.columns8
        this.screenDirection = platform.screenDirection
      })
  }

  backendJsonToForm(emailEndpointJson: CountriesEndpoint) {
    const countries = emailEndpointJson.addresses
    const group: { [key: string]: UntypedFormGroup } = {}

    countries.forEach((country) => {
      group[country.putCode] = new UntypedFormGroup({
        country: new UntypedFormControl({
          value: country.countryName,
          disabled: country.source !== this.id,
        }),
        visibility: new UntypedFormControl(country.visibility.visibility, {}),
      })
    })
    this.countryForm = new UntypedFormGroup(group)
  }

  formToBackend(countryForm: UntypedFormGroup): CountriesEndpoint {
    const countries: CountriesEndpoint = {
      errors: [],
      addresses: [],
      visibility: this.originalBackendCountries.visibility,
    }
    this._changeDetectorRef.detach()
    this.countries.reverse()
    this.countries
      .map((value) => value.putCode)
      // Clear empty inputs
      .filter((key) => countryForm.getRawValue()[key].country)
      .forEach((key, i) => {
        const countryName = countryForm.getRawValue()[key].country
        const visibility = countryForm.getRawValue()[key].visibility
        if (countryForm.getRawValue()[key]) {
          countries.addresses.push({
            putCode: key.indexOf('new-') === 0 ? null : key,
            countryName,
            iso2Country: {
              value: this.countryCodes.find((x) => x.key === countryName).value,
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
      new UntypedFormGroup({
        country: new UntypedFormControl(),
        visibility: new UntypedFormControl(this.defaultVisibility, {}),
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

  deleteCountry(putcode: string) {
    const i = this.countries.findIndex((value) => value.putCode === putcode)
    this.countries.splice(i, 1)
    this.countryForm.removeControl(putcode)
  }

  ngOnDestroy() {
    this.$destroy.next(true)
    this.$destroy.unsubscribe()
  }
}
