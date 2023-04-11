import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
  name: 'sortBy',
})
export class SortByPipe implements PipeTransform {
  transform(value: any[], order = '', column: string = ''): any[] {
    if (!value || order === '' || !order) {
      return value
    }
    if (value.length <= 1) {
      return value
    }
    if (column) {
      if (order === 'asc') {
        return sortLocalCompare(value, column)
      } else {
        return sortLocalCompare(value, column).reverse()
      }
    }
    if (order === 'asc') {
      return value.sort()
    } else {
      return value.sort().reverse()
    }
  }
}

const sortLocalCompare = (value, column) => {
  return value.sort((a, b) => a[column].localeCompare(b[column]))
}
