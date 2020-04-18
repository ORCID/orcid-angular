import { MatPaginatorIntl } from '@angular/material/paginator'
import { LOCALE } from '../../../locale/messages.dynamic.en'
import { Injectable } from '@angular/core'

@Injectable()
export class MatPaginatorIntlImplementation extends MatPaginatorIntl {
  firstPageLabel = LOCALE['ngOrcid.material.firstPageLabel']
  itemsPerPageLabel = LOCALE['ngOrcid.material.itemsPerPageLabel']
  lastPageLabel = LOCALE['ngOrcid.material.lastPageLabel']
  nextPageLabel = LOCALE['ngOrcid.material.nextPageLabel']
  previousPageLabel = LOCALE['ngOrcid.material.previousPageLabel']
  ofLabel = LOCALE['ngOrcid.material.of']

  /** The following function was taken from
  / https://github.com/angular/components/blob/dd37ca57406412c1ebeaec56cab5a517f796d4b9/src/material/paginator/paginator-intl.ts
  / With a slight change to translate the `of` label */

  /** A label for the range of items within the current page and the length of the whole list. */
  getRangeLabel = (page: number, pageSize: number, length: number) => {
    if (length === 0 || pageSize === 0) {
      return `0 ${this.ofLabel} ${length}`
    }

    length = Math.max(length, 0)

    const startIndex = page * pageSize

    // If the start index exceeds the list length, do not try and fix the end index to the end.
    const endIndex =
      startIndex < length
        ? Math.min(startIndex + pageSize, length)
        : startIndex + pageSize

    return `${startIndex + 1} – ${endIndex} ${this.ofLabel} ${length}`
  }
}
