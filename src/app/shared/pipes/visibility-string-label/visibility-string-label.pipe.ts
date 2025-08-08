import { Pipe, PipeTransform } from '@angular/core'
import {
  VisibilityStrings,
  VisibilityStringLabel,
} from 'src/app/types/common.endpoint'

@Pipe({
    name: 'visibilityStringLabel',
    standalone: false
})
export class VisibilityStringLabelPipe implements PipeTransform {
  transform(value: VisibilityStrings): unknown {
    return VisibilityStringLabel[value]
  }
}
