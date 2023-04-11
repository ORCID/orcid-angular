import { UntypedFormGroup } from '@angular/forms'
import { RegisterForm } from 'src/app/types/register.endpoint'
import { Value, Visibility } from 'src/app/types/common.endpoint'
import { Constructor } from 'src/app/types'

export function RegisterFormAdapterMixin<T extends Constructor<any>>(base: T) {
  return class RegisterFormAdapter extends base {
    formGroupToEmailRegisterForm(formGroup: UntypedFormGroup): RegisterForm {
      let additionalEmailsValue: Value[]
      if (formGroup.controls['additionalEmails']) {
        const additionalEmailsControls = (
          formGroup.controls['additionalEmails'] as UntypedFormGroup
        ).controls
        additionalEmailsValue = Object.keys(additionalEmailsControls)
          .filter((name) => additionalEmailsControls[name].value !== '')
          .map((name) => {
            if (additionalEmailsControls[name].value) {
              return { value: additionalEmailsControls[name].value }
            }
          })
      }
      let emailValue
      if (formGroup.controls['email']) {
        emailValue = formGroup.controls['email'].value
      }

      const value: RegisterForm = {}

      if (emailValue) {
        value['email'] = { value: emailValue }
      }
      if (additionalEmailsValue) {
        value['emailsAdditional'] = additionalEmailsValue
      }
      return value
    }

    formGroupToNamesRegisterForm(formGroup: UntypedFormGroup): RegisterForm {
      return {
        givenNames: { value: formGroup.controls['givenNames'].value },
        familyNames: { value: formGroup.controls['familyNames'].value },
      }
    }

    formGroupToActivitiesVisibilityForm(
      formGroup: UntypedFormGroup
    ): RegisterForm {
      let activitiesVisibilityDefault: Visibility
      if (
        formGroup &&
        formGroup.controls &&
        formGroup.controls['activitiesVisibilityDefault']
      ) {
        activitiesVisibilityDefault = {
          visibility: formGroup.controls['activitiesVisibilityDefault'].value,
        }
      }
      return { activitiesVisibilityDefault }
    }

    formGroupToPasswordRegisterForm(formGroup: UntypedFormGroup): RegisterForm {
      let password: Value
      if (formGroup && formGroup.controls && formGroup.controls['password']) {
        password = { value: formGroup.controls['password'].value }
      }
      let passwordConfirm: Value
      if (
        formGroup &&
        formGroup.controls &&
        formGroup.controls['passwordConfirm']
      ) {
        passwordConfirm = { value: formGroup.controls['passwordConfirm'].value }
      }
      return { password, passwordConfirm }
    }

    formGroupTermsOfUseAndDataProcessedRegisterForm(
      formGroup: UntypedFormGroup
    ): RegisterForm {
      let termsOfUse: Value
      let dataProcessed: Value
      if (formGroup && formGroup.controls) {
        if (formGroup.controls['termsOfUse']) {
          termsOfUse = { value: formGroup.controls['termsOfUse'].value }
        }
        if (formGroup.controls['dataProcessed']) {
          dataProcessed = { value: formGroup.controls['dataProcessed'].value }
        }
      }
      return { termsOfUse, dataProcessed }
    }

    formGroupToSendOrcidNewsForm(formGroup: UntypedFormGroup) {
      let sendOrcidNews: Value
      if (
        formGroup &&
        formGroup.controls &&
        formGroup.controls['sendOrcidNews']
      ) {
        sendOrcidNews = { value: formGroup.controls['sendOrcidNews'].value }
      }
      return { sendOrcidNews }
    }

    formGroupToRecaptchaForm(
      formGroup: UntypedFormGroup,
      widgetId: number
    ): RegisterForm {
      const value: RegisterForm = {}
      value.grecaptchaWidgetId = {
        value: widgetId != null ? widgetId.toString() : null,
      }
      if (formGroup && formGroup.controls && formGroup.controls['captcha']) {
        value.grecaptcha = { value: formGroup.controls['captcha'].value }
      }
      return value
    }

    formGroupToFullRegistrationForm(
      StepA: UntypedFormGroup,
      StepB: UntypedFormGroup,
      StepC: UntypedFormGroup
    ): RegisterForm {
      return {
        ...StepA.value.personal,
        ...StepB.value.password,
        ...StepB.value.sendOrcidNews,
        ...StepC.value.activitiesVisibilityDefault,
        ...StepC.value.termsOfUse,
        ...StepC.value.captcha,
      }
    }
  }
}
