import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms'

import { WorkIdentifiers } from './work-identifiers.validator'
import { WorkRelationships } from '../../../types/works.endpoint'

describe('WorkIdentifiers.fundedByInvalidRelationship', () => {
  let formBuilder: UntypedFormBuilder

  beforeEach(() => {
    formBuilder = new UntypedFormBuilder()
  })

  function buildForm(
    externalIdentifierType: string,
    externalRelationship: string
  ): UntypedFormGroup {
    const form = formBuilder.group({
      externalIdentifierType: [externalIdentifierType],
      externalRelationship: [externalRelationship],
    })
    form.setValidators([WorkIdentifiers.fundedByInvalidRelationship()])
    form.updateValueAndValidity()
    return form
  }

  it('allows rrid identifiers on a funded-by relationship', () => {
    const form = buildForm('rrid', WorkRelationships['funded-by'])
    expect(form.hasError('funded_by_invalid')).toBeFalse()
  })

  it('allows the previously supported identifier types on a funded-by relationship', () => {
    ;['grant_number', 'doi', 'uri', 'proposal-id'].forEach((type) => {
      const form = buildForm(type, WorkRelationships['funded-by'])
      expect(form.hasError('funded_by_invalid')).toBeFalse()
    })
  })

  it('rejects unsupported identifier types on a funded-by relationship', () => {
    ;['isbn', 'handle', 'other-id', 'source-work-id'].forEach((type) => {
      const form = buildForm(type, WorkRelationships['funded-by'])
      expect(form.hasError('funded_by_invalid')).toBeTrue()
    })
  })

  it('does not restrict identifier types on other relationships', () => {
    const form = buildForm('isbn', WorkRelationships.self)
    expect(form.hasError('funded_by_invalid')).toBeFalse()
  })
})
