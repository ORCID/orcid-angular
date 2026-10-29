import { ComponentFixture, TestBed } from '@angular/core/testing'

import { FooterComponent } from './footer.component'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { RouterTestingModule } from '@angular/router/testing'
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog'
import { WINDOW_PROVIDERS } from '../../cdk/window'
import { FormBuilder } from '@angular/forms'
import { RecordWorksService } from '../../core/record-works/record-works.service'
import { PlatformInfoService } from '../../cdk/platform-info'
import { ErrorHandlerService } from '../../core/error-handler/error-handler.service'
import { SnackbarService } from '../../cdk/snackbar/snackbar.service'
import { MatSnackBar } from '@angular/material/snack-bar'
import { Overlay } from '@angular/cdk/overlay'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { ConsentVendorService } from '../../core/consent/consent-vendor.service'

describe('FooterComponent', () => {
  let component: FooterComponent
  let fixture: ComponentFixture<FooterComponent>
  let consentVendor: jasmine.SpyObj<ConsentVendorService>

  beforeEach(() => {
    consentVendor = jasmine.createSpyObj('ConsentVendorService', [
      'openPreferences',
    ])
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      declarations: [FooterComponent],
      providers: [
        WINDOW_PROVIDERS,
        PlatformInfoService,
        { provide: ConsentVendorService, useValue: consentVendor },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(FooterComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  describe('Cookie Settings link (R6)', () => {
    function cookieSettingsLink(): HTMLElement {
      return fixture.nativeElement.querySelector('#ot-sdk-btn')
    }

    it('keeps the class OneTrust binds to', () => {
      expect(cookieSettingsLink().classList).toContain('ot-sdk-show-settings')
    })

    it('asks the consent manager to open on click', () => {
      cookieSettingsLink().click()

      expect(consentVendor.openPreferences).toHaveBeenCalledOnceWith(
        jasmine.any(MouseEvent)
      )
    })

    it('asks the consent manager to open on Enter, handing it the key event', () => {
      const enter = new KeyboardEvent('keydown', { key: 'Enter' })
      cookieSettingsLink().dispatchEvent(enter)

      expect(consentVendor.openPreferences).toHaveBeenCalledOnceWith(enter)
    })

    it('does nothing on other keys', () => {
      cookieSettingsLink().dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Tab' })
      )

      expect(consentVendor.openPreferences).not.toHaveBeenCalled()
    })
  })
})
