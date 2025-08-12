import { Pipe, PipeTransform } from '@angular/core'
import {
  FundingRelationships,
  FundingRelationshipsLabels,
} from 'src/app/types/record-funding.endpoint'

@Pipe({
  name: 'recordFundingRelationshipLabel',
  standalone: false,
})
export class RecordFundingRelationshipLabelPipe implements PipeTransform {
  transform(value: FundingRelationships): unknown {
    return FundingRelationshipsLabels[value]
  }
}
