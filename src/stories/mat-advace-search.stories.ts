import { storiesOf } from '@storybook/angular'
import { MatButtonModule, MatChipsModule } from '@angular/material'
import { action } from '@storybook/addon-actions'
import { SearchModule } from 'src/app/search/search.module'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { PlatformInfoService } from 'src/app/cdk/platform-info/platform-info.service'
import { Platform } from '@angular/cdk/platform'
import { PlatformInfoModule } from 'src/app/cdk/platform-info'
import { HttpClientModule } from '@angular/common/http'

let matChips = `
## Select/Unselect
Sample content
`

storiesOf('Components|Advanced Search', module)
  .add(
    'Plain',
    () => ({
      template: `
    <app-advance-search></app-advance-search>
    `,
      moduleMetadata: {
        imports: [
          SearchModule,
          BrowserAnimationsModule,
          HttpClientModule,
          PlatformInfoModule,
        ],
        providers: [PlatformInfoService],
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
        imports: [
          SearchModule,
          BrowserAnimationsModule,
          HttpClientModule,
          PlatformInfoModule,
        ],
        providers: [PlatformInfoService, Platform],
      },
    }),
    {
      notes: {
        markdown: matChips,
      },
    }
  )
