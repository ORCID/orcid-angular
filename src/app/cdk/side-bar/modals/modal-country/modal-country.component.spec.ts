import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ModalCountryComponent } from './modal-country.component'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { WINDOW_PROVIDERS } from '../../../window'
import { PlatformInfoService } from '../../../platform-info'
import { ErrorHandlerService } from '../../../../core/error-handler/error-handler.service'
import { SnackbarService } from '../../../snackbar/snackbar.service'
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar'
import {
  MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA,
  MatLegacyDialog as MatDialog,
  MatLegacyDialogRef as MatDialogRef,
} from '@angular/material/legacy-dialog'
import { Overlay } from '@angular/cdk/overlay'
import { RecordCountriesService } from '../../../../core/record-countries/record-countries.service'
import { HarnessLoader, parallel } from '@angular/cdk/testing'
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed'
import { ModalModule } from '../../../modal/modal.module'
import { MatIconModule } from '@angular/material/icon'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { By } from '@angular/platform-browser'
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select'
import { NoopAnimationsModule } from '@angular/platform-browser/animations'
import { Address, CountriesEndpoint } from '../../../../types'
import { SideBarModule } from '../../side-bar.module'
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button'
import { Observable, of } from 'rxjs'
import { ChangeDetectorRef } from '@angular/core'
import { MatLegacySelectHarness as MatSelectHarness } from '@angular/material/legacy-select/testing'
import { MatLegacyInputHarness as MatInputHarness } from '@angular/material/legacy-input/testing'
import { VisibilitySelectorModule } from 'src/app/cdk/visibility-selector/visibility-selector.module'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

describe('ModalCountryComponent', () => {
  let component: ModalCountryComponent
  let fixture: ComponentFixture<ModalCountryComponent>
  let recordCountriesService: RecordCountriesService
  let loader: HarnessLoader

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        HttpClientTestingModule,
        MatButtonModule,
        MatIconModule,
        MatSelectModule,
        ModalModule,
        NoopAnimationsModule,
        VisibilitySelectorModule,
        ReactiveFormsModule,
        RouterTestingModule,
        SideBarModule,
      ],
      declarations: [ModalCountryComponent],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        WINDOW_PROVIDERS,
        ChangeDetectorRef,
        RecordCountriesService,
        PlatformInfoService,
        ErrorHandlerService,
        SnackbarService,
        MatSnackBar,
        MatDialog,
        Overlay,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalCountryComponent)
    component = fixture.componentInstance

    recordCountriesService = TestBed.inject(RecordCountriesService)
    const adressesResponse: Observable<CountriesEndpoint> = of({
      errors: [],
      addresses: [],
      visibility: { visibility: 'PUBLIC' },
    })
    spyOn(recordCountriesService, 'getAddresses').and.returnValue(
      adressesResponse
    )
    loader = TestbedHarnessEnvironment.loader(fixture)

    fixture.detectChanges()
  })

  it('should create country modal with title and button with text `Add a country or location`', () => {
    expect(component).toBeTruthy()
    expect(
      fixture.debugElement.nativeElement.querySelector('p').textContent
    ).not.toBeNull()
    expect(
      fixture.debugElement.query(By.css('#add-link')).childNodes[1].nativeNode
        .textContent
    ).toBe('Add a country or location')
  })

  it('should add a country and the button text must update', () => {
    const addCountryButton = fixture.debugElement.query(By.css('#add-link'))
    addCountryButton.nativeElement.click()

    fixture.detectChanges()

    expect(
      fixture.debugElement.query(By.css('#add-link')).childNodes[1].nativeNode
        .textContent
    ).toBe('Add another country or location')
  })

  it('should display 4 countries, 2 read only (source is not the user) and 2 editable ', async () => {
    const adressesResponse: Observable<CountriesEndpoint> = of({
      errors: [],
      addresses: getAddresses(),
      visibility: { visibility: 'PUBLIC' },
    })
    recordCountriesService.getAddresses = jasmine
      .createSpy()
      .and.returnValue(adressesResponse)

    component.id = '0000-0000-0000-000X'
    component.ngOnInit()

    const countriesForm = component.countryForm

    const addCountryButton = fixture.debugElement.query(By.css('#add-link'))
    await addCountryButton.nativeElement.click()

    fixture.detectChanges()

    const countriesSelects = await loader.getAllHarnesses(MatSelectHarness)
    const countriesInputs = await loader.getAllHarnesses(MatInputHarness)

    await countriesSelects[1].open()
    await countriesSelects[1].clickOptions() //Select the first option

    // const disabledStates = await parallel(() =>
    //   countriesSelects.map((select) => select.isDisabled())
    // )

    expect(countriesForm.controls[1].value.country).toBe('AL')
    expect(countriesForm.controls[2].getRawValue().country).toBe('US')
    expect(countriesForm.controls[3].getRawValue().country).toBe('XK')
    expect(countriesForm.controls['new-0'].value.country).toBe('AF')
    expect(countriesInputs.length).toBe(2)
    expect(countriesSelects.length).toBe(2)
  })
})

function getAddresses(): Address[] {
  return [
    {
      putCode: '1',
      countryName: 'Albania',
      source: '0000-0000-0000-000X',
      sourceName: 'Test Record',
      iso2Country: {
        value: 'AL',
      },
      visibility: {
        visibility: 'PUBLIC',
      },
    } as Address,
    {
      putCode: '2',
      countryName: 'United States',
      source: '0000-0000-0000-000Z',
      sourceName: 'ORCID',
      iso2Country: {
        value: 'US',
      },
      visibility: {
        visibility: 'PRIVATE',
      },
    } as Address,
    {
      putCode: '3',
      countryName: 'Kosovo',
      iso2Country: {
        value: 'XK',
      },
      source: '0000-0000-0000-000Z',
      sourceName: 'ORCID',
      visibility: {
        visibility: 'PRIVATE',
      },
    } as Address,
  ]
}
