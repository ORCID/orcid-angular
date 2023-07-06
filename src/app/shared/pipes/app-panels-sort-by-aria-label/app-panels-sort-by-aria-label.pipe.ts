import { Pipe, PipeTransform } from '@angular/core'
import { SortOrderType } from '../../../types/sort'

@Pipe({
  name: 'appPanelsSortByAriaLabel',
})
export class AppPanelsSortByAriaLabelPipe implements PipeTransform {
  transform(sortBy: SortOrderType): string {
    switch (sortBy) {
      case 'title':
        return $localize`:@@shared.sortTitle:Sort by title`
      case 'start':
        return $localize`:@@shared.sortStart:Sort by start date`
      case 'end':
        return $localize`:@@shared.sortEnd:Sort by end date`
      case 'date':
        return $localize`:@@shared.sortDate:Sort by type`
      case 'type':
        return $localize`:@@shared.sortType:Sort by type`
      case 'order':
        return $localize`:@@shared.sortOrder:Sort by order`
    }
  }
}
