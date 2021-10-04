import { FormGroup } from '@angular/forms'

export function translatedTitleValidator({
  value,
}: FormGroup): { [key: string]: any } {
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
