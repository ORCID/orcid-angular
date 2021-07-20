import { Pipe, PipeTransform } from '@angular/core'
import {
  WorkPublicationTypes,
  WorkConferenceTypes,
  WorkIntellectualPropertyTypes,
  WorkOtherOutputTypes,
  WorkTypesLabels,
  WorkCategories,
} from 'src/app/types/works.endpoint'

@Pipe({
  name: 'recordWorkTypeLabel',
})
export class RecordWorkTypeLabelPipe implements PipeTransform {
  transform(
    value:
      | WorkPublicationTypes
      | WorkConferenceTypes
      | WorkIntellectualPropertyTypes
      | WorkOtherOutputTypes
  ): string {
    return (
      WorkTypesLabels[WorkCategories.conference][value] ||
      WorkTypesLabels[WorkCategories.intellectual_property][value] ||
      WorkTypesLabels[WorkCategories.other_output][value] ||
      WorkTypesLabels[WorkCategories.publication][value]
    )
  }
}
