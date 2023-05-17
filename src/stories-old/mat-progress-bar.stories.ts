import { storiesOf } from '@storybook/angular'
import { MatProgressBarModule } from '@angular/material/progress-bar'

let matChips = `
## Select/Unselect
Sample content
`

storiesOf('Components/Progress Bar', module).add(
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
