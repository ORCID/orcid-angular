import { storiesOf } from '@storybook/angular'
import { MatButtonModule } from '@angular/material'

storiesOf('Material Buttons', module).add('with text', () => ({
  template: `
    <div>
      <button mat-button>Basic</button>
      <button mat-button color="primary">Primary</button>
      <button mat-button color="accent">Accent</button>
      <button mat-button color="warn">Warn</button>
      <button mat-button disabled>Disabled</button>
    </div>
    `,
  moduleMetadata: {
    imports: [MatButtonModule],
  },
}))
