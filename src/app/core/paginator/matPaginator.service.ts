import { MatPaginatorIntl } from '@angular/material/paginator'
import { Injectable } from '@angular/core'
import { BehaviorSubject, Subject } from 'rxjs'
import { LiveAnnouncer } from '@angular/cdk/a11y'

@Injectable()
export class MatPaginatorIntlImplementation extends MatPaginatorIntl {
  firstPageLabel = $localize`:@@ngOrcid.material.firstPageLabel:First page`
  itemsPerPageLabel = $localize`:@@ngOrcid.material.itemsPerPageLabel:Items per page:`
  lastPageLabel = $localize`:@@ngOrcid.material.lastPageLabel:Last page`
  nextPageLabel = $localize`:@@ngOrcid.material.nextPageLabel:Next page`
  previousPageLabel = $localize`:@@ngOrcid.material.previousPageLabel:Previous page`
  ofLabel = $localize`:@@ngOrcid.material.of:of`
  pageLabel = $localize`:@@ngOrcid.material.page:Page`

  /** The following function was taken from
  / https://github.com/angular/components/blob/dd37ca57406412c1ebeaec56cab5a517f796d4b9/src/material/paginator/paginator-intl.ts
  / With a slight change to translate the `of` label */

  /** A label for the range of items within the current page and the length of the whole list. */
  getRangeLabel = (page: number, pageSize: number, length: number) => {
    const pageLength =
      length === 0 || pageSize === 0 ? 0 : Math.ceil(length / pageSize)

    return ` ${this.pageLabel} ${page + 1} ${this.ofLabel} ${pageLength}`
  }
}
