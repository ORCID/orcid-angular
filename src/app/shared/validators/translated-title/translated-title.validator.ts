import { UntypedFormGroup } from '@angular/forms'

export function translatedTitleValidator({ value }: UntypedFormGroup): {
  [key: string]: any
} {
  const translatedTitleContent = value?.translatedTitleContent
  const translatedTitleLanguage = value?.translatedTitleLanguage
  if (translatedTitleContent && !translatedTitleLanguage) {
    return { invalidTranslatedTitleLanguage: true }
  } else if (!translatedTitleContent && translatedTitleLanguage) {
    return { invalidTranslatedTitleContent: true }
  } else {
    return null
  }
}
