import { UntypedFormGroup } from '@angular/forms'
import { Constructor } from 'src/app/types'
import { Value, Visibility } from 'src/app/types/common.endpoint'
import { RegisterForm } from 'src/app/types/register.endpoint'

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

    formGroupToAffiliationRegisterForm(formGroup: UntypedFormGroup) {
      const value = formGroup.controls['organization'].value
      const departmentName = formGroup.controls['departmentName'].value
      const roleTitle = formGroup.controls['roleTitle'].value
      const startDateGroup = formGroup.controls['startDateGroup'].value

      if (typeof value === 'string') {
        return { affiliationName: { value } }
      } else {
        return {
          affiliationName: { value: value.value },
          disambiguatedAffiliationSourceId: {
            value: value.disambiguatedAffiliationIdentifier,
          },
          orgDisambiguatedId: {
            value: value.disambiguatedAffiliationIdentifier,
          },
          departmentName: { value: departmentName },
          roleTitle: { value: roleTitle },
          affiliationType: { value: 'employment' },
          startDate: {
            month: startDateGroup.startDateMonth,
            year: startDateGroup.startDateYear,
          },
          sourceId: { value: value.sourceId },
          city: { value: value.city },
          region: { value: value.region },
          country: { value: value.country },
        }
      }
    }

    formGroupToFullRegistrationForm(
      StepA: UntypedFormGroup,
      StepB: UntypedFormGroup,
      StepC: UntypedFormGroup,
      StepC2: UntypedFormGroup,
      StepD: UntypedFormGroup
    ): RegisterForm {
      const value = {
        ...StepA.value.personal,
        ...StepB.value.password,
        ...StepC.value.activitiesVisibilityDefault,
        ...StepD.value.sendOrcidNews,
        ...StepD.value.termsOfUse,
        ...StepD.value.captcha,
      }

      if (StepC2.valid) {
        return {
          ...value,
          ...StepC2.value.affiliations,
        }
      } else {
        return value
      }
    }
  }
}
