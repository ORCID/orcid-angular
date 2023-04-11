import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ModalCountryComponent } from './modal-country.component'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { WINDOW_PROVIDERS } from '../../../window'
import { PlatformInfoService } from '../../../platform-info'
import { ErrorHandlerService } from '../../../../core/error-handler/error-handler.service'
import { SnackbarService } from '../../../snackbar/snackbar.service'
import { MatSnackBar } from '@angular/material/snack-bar'
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog'
import { Overlay } from '@angular/cdk/overlay'
import { RecordCountriesService } from '../../../../core/record-countries/record-countries.service'
import { HarnessLoader, parallel } from '@angular/cdk/testing'
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed'
import { ModalModule } from '../../../modal/modal.module'
import { MatIconModule } from '@angular/material/icon'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { By } from '@angular/platform-browser'
import { MatSelectModule } from '@angular/material/select'
import { NoopAnimationsModule } from '@angular/platform-browser/animations'
import { Address, CountriesEndpoint } from '../../../../types'
import { PrivacySelectorModule } from '../../../privacy-selector/privacy-selector.module'
import { SideBarModule } from '../../side-bar.module'
import { MatButtonModule } from '@angular/material/button'
import { Observable, of } from 'rxjs'
import { ChangeDetectorRef } from '@angular/core'
import { MatSelectHarness } from '@angular/material/select/testing'
import { MatInputHarness } from '@angular/material/input/testing'

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
        PrivacySelectorModule,
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

    expect(countriesForm.controls[1].value.country).toBe('Albania')
    expect(countriesForm.controls[2].getRawValue().country).toBe(
      'United States'
    )
    expect(countriesForm.controls[3].getRawValue().country).toBe('Kosovo')
    expect(countriesForm.controls['new-0'].value.country).toBe('Afghanistan')
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
      visibility: {
        visibility: 'PUBLIC',
      },
    } as Address,
    {
      putCode: '2',
      countryName: 'United States',
      source: '0000-0000-0000-000Z',
      sourceName: 'ORCID',
      visibility: {
        visibility: 'PRIVATE',
      },
    } as Address,
    {
      putCode: '3',
      countryName: 'Kosovo',
      source: '0000-0000-0000-000Z',
      sourceName: 'ORCID',
      visibility: {
        visibility: 'PRIVATE',
      },
    } as Address,
  ]
}
