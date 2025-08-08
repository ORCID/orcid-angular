import { Pipe, PipeTransform } from '@angular/core'
import {
  FundingTypes,
  FundingTypesLabel,
} from 'src/app/types/record-funding.endpoint'

@Pipe({
    name: 'recordFundingTypesLabel',
    standalone: false
})
export class RecordFundingTypeLabelPipe implements PipeTransform {
  transform(value: FundingTypes): unknown {
    return FundingTypesLabel[value]
  }
}
