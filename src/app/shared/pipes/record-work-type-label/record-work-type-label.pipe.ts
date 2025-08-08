import { Pipe, PipeTransform } from '@angular/core'
import { WorkTypesLabels, WorkTypes } from 'src/app/types/works.endpoint'

@Pipe({
    name: 'recordWorkTypeLabel',
    standalone: false
})
export class RecordWorkTypeLabelPipe implements PipeTransform {
  transform(value: WorkTypes): string {
    return WorkTypesLabels[value]
  }
}
