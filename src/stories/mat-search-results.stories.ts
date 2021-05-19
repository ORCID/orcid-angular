import { storiesOf } from '@storybook/angular'
import { SearchModule } from '../../src/app/search/search.module'
import mockSearchResults from '../../.mockData/mock-search.json'
import { PlatformInfoService } from '../../src/app/cdk/platform-info/platform-info.service'
import { Platform } from '@angular/cdk/platform'

storiesOf('Components/Search Results', module)
  .add(
    'show results',
    () => ({
      template: `
<app-results [searchResults]="searchResults"></app-results>
`,
      moduleMetadata: {
        imports: [SearchModule],
        providers: [PlatformInfoService, Platform],
      },
      props: {
        searchResults: mockSearchResults,
      },
    }),
    {
      notes: {
        markdown: `
      Display message to announce that not results where found.
      `,
      },
    }
  )
  .add(
    'no results',
    () => ({
      template: `
    <app-results [searchResults]="searchResults"></app-results>
    `,
      moduleMetadata: {
        imports: [SearchModule],
        providers: [PlatformInfoService, Platform],
      },
      props: {
        searchResults: {},
      },
    }),
    {
      notes: {
        markdown: `
        Display a list of results
        `,
      },
    }
  )
