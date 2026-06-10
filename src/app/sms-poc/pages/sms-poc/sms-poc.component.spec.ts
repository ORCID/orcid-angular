import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { ReactiveFormsModule } from '@angular/forms'
import { MatRadioModule } from '@angular/material/radio'
import IntlTelInput from '@intl-tel-input/angular'
import { of } from 'rxjs'

import { SmsPocService } from 'src/app/core/sms-poc/sms-poc.service'
import { SmsPocComponent } from './sms-poc.component'

describe('SmsPocComponent', () => {
  let component: SmsPocComponent
  let fixture: ComponentFixture<SmsPocComponent>
  let smsPocService: jasmine.SpyObj<SmsPocService>

  beforeEach(() => {
    smsPocService = jasmine.createSpyObj('SmsPocService', ['send'])

    TestBed.configureTestingModule({
      imports: [IntlTelInput, MatRadioModule, ReactiveFormsModule],
      declarations: [SmsPocComponent],
      providers: [{ provide: SmsPocService, useValue: smsPocService }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(SmsPocComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('does not call the backend when the form is invalid', () => {
    component.smsForm.controls['phoneNumber'].setValue('')
    component.smsForm.controls['message'].setValue('ORCID SMS POC test')

    component.onSubmit()

    expect(smsPocService.send).not.toHaveBeenCalled()
    expect(component.smsForm.touched).toBeTrue()
  })

  it('calls the backend when the form is valid', () => {
    smsPocService.send.and.returnValue(
      of({
        success: true,
        provider: 'aws',
        providerMessageId: 'message-id',
        normalizedPhoneNumber: '+50688888888',
        status: 'SENT',
      })
    )
    component.smsForm.controls['phoneNumber'].setValue('+50688888888')
    component.smsForm.controls['message'].setValue('ORCID SMS POC test')

    component.onSubmit()

    expect(smsPocService.send).toHaveBeenCalledWith({
      provider: 'aws',
      phoneNumber: '+50688888888',
      message: 'ORCID SMS POC test',
    })
    expect(component.response?.success).toBeTrue()
  })

  it('sends the selected provider to the backend', () => {
    smsPocService.send.and.returnValue(
      of({
        success: true,
        provider: 'twilio',
        providerMessageId: 'message-id',
        normalizedPhoneNumber: '+50688888888',
        status: 'SENT',
      })
    )
    component.smsForm.controls['provider'].setValue('twilio')
    component.smsForm.controls['phoneNumber'].setValue('+50688888888')
    component.smsForm.controls['message'].setValue('ORCID SMS POC test')

    component.onSubmit()

    expect(smsPocService.send).toHaveBeenCalledWith({
      provider: 'twilio',
      phoneNumber: '+50688888888',
      message: 'ORCID SMS POC test',
    })
  })
})
