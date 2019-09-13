import { storiesOf } from '@storybook/angular'
import { MatButtonModule, MatChipsModule } from '@angular/material'
import { action } from '@storybook/addon-actions'

let matChips = `
## Select/Unselect
Sample content
`

storiesOf('Material Palette', module)
  .add(
    'Primary',
    () => ({
      template: `
      <div style="display: flex; width: 200px;">
      <div
        style="
          width: 100px;
      "
      >
        <div class="primary-palette-900">900</div>
        <div class="primary-palette-800">800</div>
        <div class="primary-palette-700">700</div>
        <div class="primary-palette-600">600</div>
        <div class="primary-palette-500">500</div>
      </div>
      <div
        style="
          width: 100px;
      "
      >
        <div class="primary-palette-400">400</div>
        <div class="primary-palette-300">300</div>
        <div class="primary-palette-200">200</div>
        <div class="primary-palette-100">100</div>
        <div class="primary-palette-50">50</div>
      </div>
      <div></div>
    </div>
    `,
    }),
    {
      notes: {
        markdown: matChips,
      },
    }
  )
  .add(
    'Accent',
    () => ({
      template: `
      <div style="display: flex; width: 200px;">
      <div
        style="
          width: 100px;
      "
      >
        <div class="accent-palette-900">900</div>
        <div class="accent-palette-800">800</div>
        <div class="accent-palette-700">700</div>
        <div class="accent-palette-600">600</div>
        <div class="accent-palette-500">500</div>
      </div>
      <div
        style="
          width: 100px;
      "
      >
        <div class="accent-palette-400">400</div>
        <div class="accent-palette-300">300</div>
        <div class="accent-palette-200">200</div>
        <div class="accent-palette-100">100</div>
        <div class="accent-palette-50">50</div>
      </div>
      <div></div>
    </div>
    `,
    }),
    {
      notes: {
        markdown: matChips,
      },
    }
  )
  .add(
    'Warn',
    () => ({
      template: `
      <div style="display: flex; width: 200px;">
      <div
        style="
          width: 100px;
      "
      >
        <div class="warn-palette-900">900</div>
        <div class="warn-palette-800">800</div>
        <div class="warn-palette-700">700</div>
        <div class="warn-palette-600">600</div>
        <div class="warn-palette-500">500</div>
      </div>
      <div
        style="
          width: 100px;
      "
      >
        <div class="warn-palette-400">400</div>
        <div class="warn-palette-300">300</div>
        <div class="warn-palette-200">200</div>
        <div class="warn-palette-100">100</div>
        <div class="warn-palette-50">50</div>
      </div>
      <div></div>
    </div>
    `,
    }),
    {
      notes: {
        markdown: matChips,
      },
    }
  )
