import { storiesOf } from '@storybook/angular'
import { MatButtonModule, MatIconModule } from '@angular/material'
import { action } from '@storybook/addon-actions'

let matChips = `
## Select/Unselect
Sample content
`

storiesOf('Components|Urls', module).add(
  'Plain',
  () => ({
    styles: [
      `
    button: {
      margin: 10px;
    }
    `,
    ],
    template: `
        <a href="#">Link</a>
    `,

    moduleMetadata: {
      imports: [],
    },
  }),
  {
    notes: {
      markdown: matChips,
    },
  }
)
