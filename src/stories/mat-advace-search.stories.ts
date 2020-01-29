import { storiesOf } from '@storybook/angular'
import { MatButtonModule, MatChipsModule } from '@angular/material'
import { action } from '@storybook/addon-actions'
import { SearchModule } from 'src/app/search/search.module'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'

let matChips = `
## Select/Unselect
Sample content
`

storiesOf('Components|Advance Search', module)
  .add(
    'Plain',
    () => ({
      template: `
    <app-advance-search></app-advance-search>
    `,
      moduleMetadata: {
        imports: [SearchModule, BrowserAnimationsModule],
      },
    }),
    {
      notes: {
        markdown: matChips,
      },
    }
  )
  .add(
    'Preset values',
    () => ({
      template: `
    <app-advance-search [searchValues]="searchParams"></app-advance-search>
    `,
      props: {
        searchParams: {
          firstName: 'first name',
          lastName: 'lastName',
          institution: 'institution',
          keyword: 'keys',
          otherFields: true,
          orcid: '1234-1234-1234-123X',
        },
      },
      moduleMetadata: {
        imports: [SearchModule, BrowserAnimationsModule],
      },
    }),
    {
      notes: {
        markdown: matChips,
      },
    }
  )
