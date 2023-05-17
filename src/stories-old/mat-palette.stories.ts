import { storiesOf } from '@storybook/angular'
import { environment } from '../environments/environment'

let matChips = `
## Select/Unselect
Sample content
`
if (environment) {
  // This ensures that the basePath typeScript feature works with storybook
}

storiesOf('Foundation/Palette', module)
  .add(
    'Primary',
    () => ({
      template: `
      <div style="display: flex; width: 600px;">
      <div
      style="
      width: 300px;
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
      width: 300px;
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
      <div style="display: flex; width: 600px;">
      <div
      style="
          width: 300px;
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
        width: 300px;
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
      <div style="display: flex; width: 600px;">
      <div
      style="
      width: 300px;
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
      width: 300px;
  "
      >
        <div class="warn-palette-400">400</div>
        <div class="warn-palette-300">300</div>
        <div class="warn-palette-200">200</div>
        <div class="warn-palette-100">100</div>
        <div class="warn-palette-50">50</div>
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
  .add(
    'Foreground',
    () => ({
      template: `
      <div style="display: flex; width: 600px;">
      <div
        style="
          width: 300px;
      "
      >
        <div class="foreground-palette-base">base</div>
        <div class="foreground-palette-divider">divider</div>
        <div class="foreground-palette-dividers">dividers</div>
        <div class="foreground-palette-disabled-button">disabled-button</div>
        <div class="foreground-palette-disabled-text">disabled-text</div>
        <div class="foreground-palette-elevation">elevation</div>
        </div>
        <div
        style="
          width: 300px;
      "
      >
        <div class="foreground-palette-hint-text">hint-text</div>
        <div class="foreground-palette-secondary-text">secondary-text</div>
        <div class="foreground-palette-icon">icon</div>
        <div class="foreground-palette-icons">icons</div>
        <div class="foreground-palette-slider-min">slider-min</div>
        <div class="foreground-palette-50">slider-off-active</div>

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
  .add(
    'Background',
    () => ({
      template: `
      <div style="display: flex; width: 600px;">
      <div
        style="
          width: 300px;
      "
      >
        <div class="foreground-palette-status-bar">status-bar</div>
        <div class="foreground-palette-app-bar">app-bar</div>
        <div class="foreground-palette-background">background</div>
        <div class="foreground-palette-hover">hover</div>
        <div class="foreground-palette-card">card</div>
        <div class="foreground-palette-dialog">dialog</div>
        <div class="foreground-palette-disabled-button">disabled-button</div>
        <div class="foreground-palette-raised-button">raised-button</div>
        <div class="foreground-palette-focused-button">focused-button</div>
        </div>
        <div
        style="
          width: 300px;
      "
      >
        <div class="foreground-palette-selected-button">selected-button</div>
        <div class="foreground-palette-selected-disabled-button">selected-disabled-button</div>
        <div class="foreground-palette-disabled-button-toggle">disabled-button-toggle</div>
        <div class="foreground-palette-unselected-chip">unselected-chip <i>custom</i></div>
        <div class="foreground-palette-disabled-list-option">disabled-list-option</div>
        <div class="foreground-palette-app-news">app-news <i>added</i></div>
        <div class="foreground-palette-light-grey">light-grey <i>added</i></div>
        <div class="foreground-palette-blue-overlay">blue-overlay <i>added</i></div>
        <div class="foreground-palette-dark-grey">dark-grey <i>added</i></div>
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
