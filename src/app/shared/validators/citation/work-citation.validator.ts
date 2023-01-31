import { UntypedFormGroup } from '@angular/forms'

export function workCitationValidator({ value }: UntypedFormGroup): {
  [key: string]: any
} {
  const workCitation = value?.citation
  const workCitationType = value?.citationType
  if (workCitation && !workCitationType) {
    return { citationType: true }
  } else if (!workCitation && workCitationType) {
    return { citation: true }
  } else {
    return null
  }
}
