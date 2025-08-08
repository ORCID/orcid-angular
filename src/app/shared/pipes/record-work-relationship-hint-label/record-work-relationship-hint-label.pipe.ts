import { Pipe, PipeTransform } from '@angular/core'
import {
  WorkRelationships,
  WorkRelationshipsHintsLabels,
} from 'src/app/types/works.endpoint'

@Pipe({
    name: 'recordWorkRelationshipHintLabel',
    standalone: false
})
export class RecordWorkRelationshipHintLabelPipe implements PipeTransform {
  transform(value: WorkRelationships): unknown {
    return WorkRelationshipsHintsLabels[value]
  }
}
