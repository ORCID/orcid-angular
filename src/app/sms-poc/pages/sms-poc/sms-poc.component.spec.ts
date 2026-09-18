import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { ReactiveFormsModule } from '@angular/forms'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatRadioModule } from '@angular/material/radio'
import { ActivatedRoute } from '@angular/router'
import IntlTelInput from '@intl-tel-input/angular'
import { of } from 'rxjs'

import { SmsPocService } from 'src/app/core/sms-poc/sms-poc.service'
import { SmsPocComponent } from './sms-poc.component'

describe('SmsPocComponent', () => {
  let component: SmsPocComponent
  let fixture: ComponentFixture<SmsPocComponent>
  let smsPocService: jasmine.SpyObj<SmsPocService>

  beforeEach(() => {
    smsPocService = jasmine.createSpyObj('SmsPocService', ['send', 'verify'])

    TestBed.configureTestingModule({
      imports: [
        IntlTelInput,
        MatCheckboxModule,
        MatRadioModule,
        ReactiveFormsModule,
      ],
      declarations: [SmsPocComponent],
      providers: [
        { provide: SmsPocService, useValue: smsPocService },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { queryParamMap: { get: () => null } } },
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(SmsPocComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  function sendSuccess(provider = 'aws') {
    return of({
      success: true,
      provider,
      providerMessageId: 'message-id',
      normalizedPhoneNumber: '+50688888888',
      status: 'SENT',
    })
  }

  it('does not call the backend without consent', () => {
    component.smsForm.controls['phoneNumber'].setValue('+50688888888')
    component.smsForm.controls['consent'].setValue(false)

    component.onSubmit()

    expect(smsPocService.send).not.toHaveBeenCalled()
    expect(component.smsForm.touched).toBeTrue()
  })

  it('sends only phone number and provider when the form is valid', () => {
    smsPocService.send.and.returnValue(sendSuccess())
    component.smsForm.controls['phoneNumber'].setValue('+50688888888')
    component.smsForm.controls['consent'].setValue(true)

    component.onSubmit()

    expect(smsPocService.send).toHaveBeenCalledWith({
      provider: 'aws',
      phoneNumber: '+50688888888',
      locale: 'en-US',
    })
    expect(component.step).toBe('verify')
    expect(component.verifiedPhoneNumber).toBe('+50688888888')
  })

  it('sends the selected provider to the backend', () => {
    smsPocService.send.and.returnValue(sendSuccess('twilio'))
    component.smsForm.controls['provider'].setValue('twilio')
    component.smsForm.controls['phoneNumber'].setValue('+50688888888')
    component.smsForm.controls['consent'].setValue(true)

    component.onSubmit()

    expect(smsPocService.send).toHaveBeenCalledWith({
      provider: 'twilio',
      phoneNumber: '+50688888888',
      locale: 'en-US',
    })
  })

  it('verifies the code against the normalized number', () => {
    smsPocService.send.and.returnValue(sendSuccess())
    smsPocService.verify.and.returnValue(
      of({
        success: true,
        provider: 'aws',
        normalizedPhoneNumber: '+50688888888',
        status: 'VERIFIED',
        verified: true,
      })
    )
    component.smsForm.controls['phoneNumber'].setValue('+50688888888')
    component.smsForm.controls['consent'].setValue(true)
    component.onSubmit()

    component.verifyForm.controls['code'].setValue('123456')
    component.onVerify()

    expect(smsPocService.verify).toHaveBeenCalledWith({
      phoneNumber: '+50688888888',
      code: '123456',
    })
    expect(component.verifyResponse?.verified).toBeTrue()
  })
})
