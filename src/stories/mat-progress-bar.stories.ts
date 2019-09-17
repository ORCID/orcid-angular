import { storiesOf } from '@storybook/angular'
import { MatProgressBarModule } from '@angular/material'

let matChips = `
## Select/Unselect
Sample content
`

storiesOf('Progress Bar', module).add(
  'Indeterminate',
  () => ({
    template: `
    <mat-progress-bar mode="indeterminate"></mat-progress-bar>
    `,
    moduleMetadata: {
      imports: [MatProgressBarModule],
    },
  }),
  {
    notes: {
      markdown: matChips,
    },
  }
)
