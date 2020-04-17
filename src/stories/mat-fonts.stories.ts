import { storiesOf } from '@storybook/angular'
import { MatButtonModule, MatChipsModule } from '@angular/material'
import { action } from '@storybook/addon-actions'

let matChips = `
## Select/Unselect
Sample content
`

storiesOf('Foundation|Fonts', module).add(
  'Noto Sans',
  () => ({
    template: `
      <div style="display: flex; width: 1200px;">
      <div
      style="
      width: 1200px;
  "
      >
        <div class="mat-display-4	">mat-display-4</div>
        <div class="mat-display-3">mat-display-3</div>
        <div class="mat-display-2">mat-display-2</div>
        <div class="mat-display-1">mat-display-1</div>
        <div class="mat-headline">mat-headline</div>
        <div class="mat-title"> mat-title</div>
        <div class="mat-card-title"> mat-title</div>
        <div class="mat-subheading-2"> mat-card-title</div>
        <div class="mat-subheading-1">mat-subheading-1</div>
        <div class="mat-body-1">mat-body-1</div>
        <div class="mat-body-2">mat-body-2</div>
        <div class="mat-caption	">mat-caption	</div>
        <div class="title-alt"> title-alt</div>
        <div class="mat-button-font"> mat-button-font</div>

      </div>

    </div>
    `,
  }),
  {
    notes: {
      markdown: matChips,
    },
  }
)
