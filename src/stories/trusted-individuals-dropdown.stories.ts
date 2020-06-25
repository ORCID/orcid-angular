import { storiesOf } from '@storybook/angular'
import { action } from '@storybook/addon-actions'
import MockTrustedIndividuals from '../../.mockData/mock-trusted-individuals.json'
import MockTrustedIndividualsMe from '../../.mockData/mock-trusted-individuals-me.json'

import { TrustedIndividualsDropdownModule } from 'src/app/cdk/trusted-individuals-dropdown/trusted-individuals-dropdown.module'
import { MatMenuModule } from '@angular/material/menu'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'

let matChips = `
## Select/Unselect
Sample content
`

storiesOf('Components|Trusted individuals dropdown', module)
  .add(
    'plain',
    () => ({
      template: `
    <app-trusted-individuals-dropdown
    (changeUser)="changeAccount($event)"
    [trustedIndividuals]="trustedIndividuals"
    ></app-trusted-individuals-dropdown>
  `,
      props: {
        changeAccount: action('log'),
        trustedIndividuals: MockTrustedIndividuals,
      },
      moduleMetadata: {
        imports: [
          TrustedIndividualsDropdownModule,
          MatMenuModule,
          MatButtonModule,
          MatIconModule,
          BrowserAnimationsModule,
        ],
        providers: [],
      },
    }),
    {
      notes: {
        markdown: matChips,
      },
    }
  )
  .add(
    'go back to me',
    () => ({
      template: `
    <app-trusted-individuals-dropdown
    (changeUser)="changeAccount($event)"
    [trustedIndividuals]="trustedIndividuals"
    ></app-trusted-individuals-dropdown>
  `,
      props: {
        changeAccount: action('log'),
        trustedIndividuals: MockTrustedIndividualsMe,
      },
      moduleMetadata: {
        imports: [
          TrustedIndividualsDropdownModule,
          MatMenuModule,
          MatButtonModule,
          MatIconModule,
          BrowserAnimationsModule,
        ],
        providers: [],
      },
    }),
    {
      notes: {
        markdown: matChips,
      },
    }
  )
