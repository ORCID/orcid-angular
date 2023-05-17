import { storiesOf } from '@storybook/angular'
import { action } from '@storybook/addon-actions'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { MatPaginatorModule } from '@angular/material/paginator'

let matChips = `
## Select/Unselect
Sample content
`

storiesOf('Components/Paginator', module).add(
  'Plain',
  () => ({
    template: `
    <mat-paginator
    [pageSizeOptions]="[50, 100, 200]"
    [pageSize]="pageSize"
    [pageIndex]="pageIndex"
    [length]="length"
    (page)="changePage($event)"
  ></mat-paginator>
    `,
    props: {
      pageSize: 50,
      pageIndex: 0,
      length: 1000,
      changePage: action(`log`),
    },
    moduleMetadata: {
      imports: [MatPaginatorModule, BrowserAnimationsModule],
    },
  }),
  {
    notes: {
      markdown: matChips,
    },
  }
)
