import { UntypedFormGroup } from '@angular/forms'
import { of } from 'rxjs'
import { RegisterBackendValidatorMixin } from './register.backend-validators'

describe('registration captcha session contract', () => {
  it('sends the initialized provider and registration id with validation', () => {
    const post = jasmine.createSpy('post').and.returnValue(of({}))
    class Base {
      _http: any = { post }
      _errorHandler: any = {}
      backendRegistrationForm: any = {
        captchaProvider: 'turnstile',
        captchaRegistrationId: 'session-id',
      }
      formGroupToEmailRegisterForm() { return {} }
      formGroupToPasswordRegisterForm() { return {} }
      formGroupToFullRegistrationForm() {
        return { grecaptcha: { value: 'token' }, grecaptchaWidgetId: { value: '0' } }
      }
    }
    const service = new (RegisterBackendValidatorMixin(Base))()
    const form = new UntypedFormGroup({})
    service.backendRegisterFormValidate(form, form, form, form, form).subscribe()
    expect(post.calls.mostRecent().args[1]).toEqual(jasmine.objectContaining({
      captchaProvider: 'turnstile',
      captchaRegistrationId: 'session-id',
      grecaptcha: { value: 'token' },
      grecaptchaWidgetId: { value: '0' },
    }))
  })
})