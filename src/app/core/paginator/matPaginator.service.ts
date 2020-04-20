import { MatPaginatorIntl } from '@angular/material/paginator'
import { Injectable } from '@angular/core'

@Injectable()
export class MatPaginatorIntlImplementation extends MatPaginatorIntl {
  firstPageLabel = $localize`:@@ngOrcid.material.firstPageLabel:First page`
  itemsPerPageLabel = $localize`:@@ngOrcid.material.itemsPerPageLabel:Items per page:`
  lastPageLabel = $localize`:@@ngOrcid.material.lastPageLabel:Last page`
  nextPageLabel = $localize`:@@ngOrcid.material.nextPageLabel:Next page`
  previousPageLabel = $localize`:@@ngOrcid.material.previousPageLabel:Previous page`
  ofLabel = $localize`:@@ngOrcid.material.of:of`

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
