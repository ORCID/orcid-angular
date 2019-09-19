import { storiesOf } from '@storybook/angular'
import { MatMenuModule, MatButtonModule } from '@angular/material'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'

let matChips = `
## Select/Unselect
Sample content
`

storiesOf('Components|Menu', module).add(
  'Basic menu',
  () => ({
    template: `
    <button mat-button [matMenuTriggerFor]="menu">Menu</button>
    <mat-menu #menu="matMenu">
      <button mat-menu-item>Item 1</button>
      <button mat-menu-item>Item 2</button>
    </mat-menu>    `,
    moduleMetadata: {
      imports: [MatMenuModule, MatButtonModule, BrowserAnimationsModule],
    },
  }),
  {
    notes: {
      markdown: matChips,
    },
  }
)
