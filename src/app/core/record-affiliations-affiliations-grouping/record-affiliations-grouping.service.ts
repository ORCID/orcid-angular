import { Injectable } from '@angular/core'
import {
  AffiliationUIGroupsTypes,
  AffiliationGroupsTypes,
  AffiliationUIGroup,
  AffiliationsEndpoint,
  AffiliationType,
} from 'src/app/types/record-affiliation.endpoint'

@Injectable({
  providedIn: 'root',
})
export class RecordAffiliationsGroupingService {
  expectedUiOrderGroups = []
  constructor() {
    // The expectedUiOrderGroups list need to be ordered on the expected order to be displayed
    this.expectedUiOrderGroups[AffiliationUIGroupsTypes.EMPLOYMENT] = [
      AffiliationGroupsTypes.EMPLOYMENT,
    ]
    this.expectedUiOrderGroups[
      AffiliationUIGroupsTypes.EDUCATION_AND_QUALIFICATION
    ] = [AffiliationGroupsTypes.EDUCATION, AffiliationGroupsTypes.QUALIFICATION]
    this.expectedUiOrderGroups[
      AffiliationUIGroupsTypes.INVITED_POSITION_AND_DISTINCTION
    ] = [
      AffiliationGroupsTypes.INVITED_POSITION,
      AffiliationGroupsTypes.DISTINCTION,
    ]
    this.expectedUiOrderGroups[
      AffiliationUIGroupsTypes.MEMBERSHIP_AND_SERVICE
    ] = [AffiliationGroupsTypes.MEMBERSHIP, AffiliationGroupsTypes.SERVICE, AffiliationGroupsTypes.EDITORIAL_SERVICE]
  }

  transform(value: AffiliationsEndpoint, args?: any): AffiliationUIGroup[] {
       // Check for the presence of affiliation groups
    if (value?.affiliationGroups) {
      const originalServiceArray =
        value.affiliationGroups[AffiliationGroupsTypes.SERVICE]

      // Only run this logic if the SERVICE array exists and is not empty
      if (originalServiceArray?.length > 0) {
        const newServiceArray = []
        const editorialServiceArray = []

        for (const group of originalServiceArray) {
          // Check if any top-level external identifier in the group is of type 'ISSN'
          const hasIssn = group.externalIdentifiers?.some(
            (identifier) =>
              identifier.externalIdentifierType.value === 'issn'
          )
          if (hasIssn) {
            group.affiliationType = AffiliationGroupsTypes.EDITORIAL_SERVICE

            for (const affiliation of group.affiliations) {
              if (affiliation.affiliationType) {
                affiliation.affiliationType.value = AffiliationType['editorial-service'];
              }
          }
            editorialServiceArray.push(group)
          } else {
            newServiceArray.push(group)
          }
        }
        // Overwrite the original SERVICE array and add the new EDITORIAL_SERVICE array
        value.affiliationGroups[AffiliationGroupsTypes.SERVICE] =
          newServiceArray
        value.affiliationGroups[AffiliationGroupsTypes.EDITORIAL_SERVICE] =
          editorialServiceArray
      }
    }
    if (Object.keys(value.affiliationGroups).length) {
      return Object.keys(this.expectedUiOrderGroups).map(
        (expectedUiOrderGroup) => {
          return {
            type: expectedUiOrderGroup,
            affiliationGroup: this.expectedUiOrderGroups[expectedUiOrderGroup]
              .map((AffiliationGroupsTypeName) => {
                return Object.keys(value.affiliationGroups)
                  .filter((key) => {
                    return key === AffiliationGroupsTypeName
                  })
                  .map((key) => value.affiliationGroups[key])
              })
              // Reduce all elements with different AffiliationGroupsTypeName on the same expectedUiOrderGroup
              .reduce((accumulator, currentValue) =>
                accumulator.concat(currentValue)
              )
              // Concatenates affiliations lists
              .reduce((accumulator, currentValue) =>
                accumulator.concat(currentValue)
              ),
          }
        }
      )
    } else {
      return []
    }
  }
}
