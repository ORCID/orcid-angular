import { RecordHolderRolesPipe } from './record-holder-roles.pipe'
import { Contributor } from '../../../types'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

describe('RecordHolderContributionPipe', () => {
  let pipe: RecordHolderRolesPipe

  beforeEach(() => {
    pipe = new RecordHolderRolesPipe()
  })

  it('create an instance', () => {
    expect(pipe).toBeTruthy()
  })

  it('should return roles of contribution holder if exist', () => {
    const contributors = getContributor()
    expect(pipe.transform(contributors, null, '0000-0000-0000-000X')).toBe(
      'Conceptualization, Project administration'
    )
    expect(pipe.transform(contributors, null, '0000-0000-0000-000Z')).toBe(null)
  })
})

function getContributor(): Contributor[] {
  return [
    {
      creditName: 'Test Name',
      contributorOrcid: {
        path: '0000-0000-0000-000X',
        uri: 'https://dev.orcid.org/0000-0000-0000-000X',
      },
      rolesAndSequences: [
        {
          contributorRole: 'conceptualization',
          contributorSequence: null,
        },
        {
          contributorRole: 'project administration',
          contributorSequence: null,
        },
      ],
    } as Contributor,
  ]
}
