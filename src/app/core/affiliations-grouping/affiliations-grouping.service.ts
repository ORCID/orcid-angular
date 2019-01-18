import { Injectable } from '@angular/core'
import {
  AffiliationGroupsTypes,
  Affiliations,
  AffiliationUIGroup,
  AffiliationUIGroupsTypes,
} from 'src/app/types'

@Injectable({
  providedIn: 'root',
})
export class AffiliationsGroupingService {
  expectedUiOrderGroups = []
  constructor() {
    // The expectedUiOrderGroups list need to be ordered on the expeted order to be displayed
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
    ] = [AffiliationGroupsTypes.MEMBERSHIP, AffiliationGroupsTypes.SERVICE]
  }

  transform(value: Affiliations, args?: any): AffiliationUIGroup[] {
    return Object.keys(this.expectedUiOrderGroups).map(expectedUiOrderGroup => {
      return {
        type: expectedUiOrderGroup,
        affiliationGroup: this.expectedUiOrderGroups[expectedUiOrderGroup]
          .map(AffiliationGroupsTypeName => {
            return Object.keys(value.affiliationGroups)
              .filter(key => {
                return key === AffiliationGroupsTypeName
              })
              .map(key => value.affiliationGroups[key])
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
    })
  }
}
