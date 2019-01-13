import { Pipe, PipeTransform } from '@angular/core'
import { KeyValue } from '@angular/common'
import {
  AffiliationGroup,
  AffiliationGroupsTypes,
  AffiliationUIGrouping,
} from '../../../types'

@Pipe({
  name: 'groupAffiliations',
})
export class GroupAffiliationsPipe implements PipeTransform {
  expectedUiOrderGroups = []
  constructor() {
    // The expectedUiOrderGroups list need to be ordered on the expeted order to be displayed
    this.expectedUiOrderGroups[AffiliationUIGrouping.EMPLOYMENT] = [
      AffiliationGroupsTypes.EMPLOYMENT,
    ]
    this.expectedUiOrderGroups[
      AffiliationUIGrouping.EDUCATION_AND_QUALIFICATION
    ] = [AffiliationGroupsTypes.EDUCATION, AffiliationGroupsTypes.QUALIFICATION]
    this.expectedUiOrderGroups[
      AffiliationUIGrouping.INVITED_POSITION_AND_DISTINCTION
    ] = [
      AffiliationGroupsTypes.INVITED_POSITION,
      AffiliationGroupsTypes.DISTINCTION,
    ]
    this.expectedUiOrderGroups[AffiliationUIGrouping.MEMBERSHIP_AND_SERVICE] = [
      AffiliationGroupsTypes.MEMBERSHIP,
      AffiliationGroupsTypes.SERVICE,
    ]
  }

  transform(
    value: KeyValue<string, AffiliationGroup[]>[],
    args?: any
  ): KeyValue<string, AffiliationGroup[]>[] {
    return Object.keys(this.expectedUiOrderGroups).map(expectedUiOrderGroup => {
      return {
        key: expectedUiOrderGroup,
        value: this.expectedUiOrderGroups[expectedUiOrderGroup]
          .map(AffiliationGroupsTypeName =>
            value
              .filter(item => item.key === AffiliationGroupsTypeName)
              .map(item => item.value)
          )
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
