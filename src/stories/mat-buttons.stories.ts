import { storiesOf } from '@storybook/angular'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'

let matChips = `
## Select/Unselect
Sample content
`

storiesOf('Components/Button', module).add(
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
      <h3>Basic Buttons</h3>
      <div class="example-button-row">
        <button mat-button>Basic</button>
        <button mat-button color="primary">Primary</button>
        <button mat-button color="accent">Accent</button>
        <button mat-button color="warn">Warn</button>
        <button mat-button disabled>Disabled</button>
        <a mat-button >Link</a>
      </div>

      <h3>Raised Buttons</h3>
      <div class="example-button-row">
        <button mat-raised-button>Basic</button>
        <button mat-raised-button color="primary">Primary</button>
        <button mat-raised-button color="accent">Accent</button>
        <button mat-raised-button color="warn">Warn</button>
        <button mat-raised-button disabled>Disabled</button>
        <a mat-raised-button >Link</a>
      </div>

      <h3>Stroked Buttons</h3>
      <div class="example-button-row">
        <button mat-stroked-button>Basic</button>
        <button mat-stroked-button color="primary">Primary</button>
        <button mat-stroked-button color="accent">Accent</button>
        <button mat-stroked-button color="warn">Warn</button>
        <button mat-stroked-button disabled>Disabled</button>
        <a mat-stroked-button >Link</a>
      </div>

      <h3>Flat Buttons</h3>
      <div class="example-button-row">
        <button mat-flat-button>Basic</button>
        <button mat-flat-button color="primary">Primary</button>
        <button mat-flat-button color="accent">Accent</button>
        <button mat-flat-button color="warn">Warn</button>
        <button mat-flat-button disabled>Disabled</button>
        <a mat-flat-button >Link</a>
      </div>

      <h3>Icon Buttons</h3>
      <div class="example-button-row">
        <button mat-icon-button aria-label="Example icon-button with a heart icon">
          <mat-icon>favorite</mat-icon>
        </button>
        <button mat-icon-button color="primary" aria-label="Example icon-button with a heart icon">
          <mat-icon>favorite</mat-icon>
        </button>
        <button mat-icon-button color="accent" aria-label="Example icon-button with a heart icon">
          <mat-icon>favorite</mat-icon>
        </button>
        <button mat-icon-button color="warn" aria-label="Example icon-button with a heart icon">
          <mat-icon>favorite</mat-icon> 
        </button>
        <button mat-icon-button disabled aria-label="Example icon-button with a heart icon">
          <mat-icon>favorite</mat-icon>
        </button>
      </div>

      <h3>Fab Buttons</h3>
      <div class="example-button-row">
        <button mat-fab>Basic</button>
        <button mat-fab color="primary">Primary</button>
        <button mat-fab color="accent">Accent</button>
        <button mat-fab color="warn">Warn</button>
        <button mat-fab disabled>Disabled</button>
        <button mat-fab aria-label="Example icon-button with a heart icon">
          <mat-icon>favorite</mat-icon>
        </button>
        <a mat-fab >Link</a>
      </div>

      <h3>Mini Fab Buttons</h3>
      <div class="example-button-row">
        <button mat-mini-fab>Basic</button>
        <button mat-mini-fab color="primary">Primary</button>
        <button mat-mini-fab color="accent">Accent</button>
        <button mat-mini-fab color="warn">Warn</button>
        <button mat-mini-fab disabled>Disabled</button>
        <button mat-mini-fab aria-label="Example icon-button with a heart icon">
          <mat-icon>favorite</mat-icon>
        </button>
        <a mat-mini-fab >Link</a>
      </div>
    `,
    moduleMetadata: {
      imports: [MatButtonModule, MatIconModule],
    },
  }),
  {
    notes: {
      markdown: matChips,
    },
  }
)
