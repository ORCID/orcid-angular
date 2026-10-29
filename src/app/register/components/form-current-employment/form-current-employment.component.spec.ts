import { ComponentFixture, TestBed } from '@angular/core/testing'

import { Overlay } from '@angular/cdk/overlay'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { MatDialog } from '@angular/material/dialog'
import { MatSnackBar } from '@angular/material/snack-bar'
import { RouterTestingModule } from '@angular/router/testing'
import { PlatformInfoService } from '../../../cdk/platform-info'
import { MdePopoverModule } from '../../../cdk/popover'
import { SnackbarService } from '../../../cdk/snackbar/snackbar.service'
import { WINDOW_PROVIDERS } from '../../../cdk/window'
import { ErrorHandlerService } from '../../../core/error-handler/error-handler.service'
import { ReactivationService } from '../../../core/reactivation/reactivation.service'
import { RegisterService } from '../../../core/register/register.service'
import { FormCurrentEmploymentComponent } from './form-current-employment.component'
import {
  MatAutocomplete,
  MatAutocompleteModule,
} from '@angular/material/autocomplete'
import { SharedModule } from 'src/app/shared/shared.module'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { RegisterObservabilityService } from '../../register-observability.service'

describe('FormCurrentEmploymentComponent', () => {
  let component: FormCurrentEmploymentComponent
  let fixture: ComponentFixture<FormCurrentEmploymentComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        MdePopoverModule,
        RouterTestingModule,
        MatAutocompleteModule,
        SharedModule,
      ],
      declarations: [FormCurrentEmploymentComponent],
      providers: [
        WINDOW_PROVIDERS,
        ReactivationService,
        RegisterService,
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
    fixture = TestBed.createComponent(FormCurrentEmploymentComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  describe('the "not ready to add your affiliation" notice', () => {
    const notice = () =>
      fixture.nativeElement.querySelector('#step-c2-not-ready-notice')

    it('is shown while no affiliation has been suggested', () => {
      expect(component.rorIdHasBeenMatched).toBeUndefined()
      expect(notice()).toBeTruthy()
      expect(notice().textContent).toContain(
        'Not ready to add your affiliation?'
      )
    })

    it('is hidden once an affiliation has been matched', () => {
      component.rorIdHasBeenMatched = true
      fixture.detectChanges()

      expect(notice()).toBeNull()
    })

    it('comes back when the matched organization is cleared', () => {
      component.rorIdHasBeenMatched = true
      fixture.detectChanges()

      component.clearForm()
      fixture.detectChanges()

      expect(notice()).toBeTruthy()
    })

    it('skips the step and reports it', () => {
      const observability = TestBed.inject(RegisterObservabilityService)
      spyOn(observability, 'stepC2NoticeSkipLinkClicked')
      const skipStep = jasmine.createSpy('skipStep')
      component.skipStep.subscribe(skipStep)

      fixture.nativeElement.querySelector('#step-c2-notice-skip-link').click()

      expect(observability.stepC2NoticeSkipLinkClicked).toHaveBeenCalled()
      expect(skipStep).toHaveBeenCalled()
    })
  })

  describe('the unidentified organization error', () => {
    beforeEach(() => {
      component.form.get('organization').setValue('university of b')
      component.form.get('organization').markAsTouched()
      component.selectedOrganizationFromDatabase = undefined
      component.displayOrganizationHint = true
      fixture.detectChanges()
    })

    const error = () =>
      fixture.nativeElement.querySelector('#organization-not-found-error')

    it('tells the user the organization is unknown and can be skipped', () => {
      expect(error()).toBeTruthy()
      expect(error().getAttribute('role')).toBe('alert')
      expect(error().textContent).toContain(
        'This organization is not in our database.'
      )
      expect(
        error().querySelector('#step-c2-error-skip-link').textContent
      ).toContain('skip this step')
    })

    it('skips the step and reports it', () => {
      const observability = TestBed.inject(RegisterObservabilityService)
      spyOn(observability, 'stepC2ErrorSkipLinkClicked')
      const skipStep = jasmine.createSpy('skipStep')
      component.skipStep.subscribe(skipStep)

      error().querySelector('#step-c2-error-skip-link').click()

      expect(observability.stepC2ErrorSkipLinkClicked).toHaveBeenCalled()
      expect(skipStep).toHaveBeenCalled()
    })
  })
})
