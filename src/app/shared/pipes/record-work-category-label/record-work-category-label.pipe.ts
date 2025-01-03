import { Pipe, PipeTransform } from '@angular/core'
import {
  WorkCategories,
  WorkCategoriesLabel,
} from 'src/app/types/works.endpoint'

@Pipe({
  name: 'recordWorkCategoryLabel',
})
export class RecordWorkCategoryLabelPipe implements PipeTransform {
  transform(value: WorkCategories, ...args: unknown[]): string {
    return WorkCategoriesLabel[value]
  }
}
