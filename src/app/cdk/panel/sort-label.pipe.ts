import { Pipe, PipeTransform } from '@angular/core'
import { SortOrderType } from 'src/app/types/sort'

@Pipe({
    name: 'sortLabel',
    standalone: false
})
export class SortLabelPipe implements PipeTransform {
  SortOrderTypeLabel = {
    title: $localize`:@@share.sortTitle:Title`,
    start: $localize`:@@share.sortStart:Start`,
    end: $localize`:@@share.sortEnd:End`,
    date: $localize`:@@share.sortDate:Date`,
    type: $localize`:@@share.sortType:Type`,
    order: $localize`:@@share.sortOrderv2:Publication/Grant title`,
    source: $localize`:@@shared.source:Source`,
  }
  transform(value: SortOrderType): string {
    return this.SortOrderTypeLabel[value]
  }
}
