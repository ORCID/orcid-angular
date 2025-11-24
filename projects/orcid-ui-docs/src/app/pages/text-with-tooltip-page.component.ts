import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatButtonModule } from '@angular/material/button'
import { TextWithTooltipComponent } from '@orcid/ui'

@Component({
  selector: 'orcid-text-with-tooltip-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TextWithTooltipComponent,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  template: `
    <h2>Text with Tooltip</h2>
    <p>
      The <code>TextWithTooltipComponent</code> displays text with a tooltip
      that only appears when the text overflows its container. The tooltip
      follows the cursor and shows the full text content.
    </p>

    <section class="docs-section">
      <h3>Examples</h3>
      <p>Hover over the text below to see the tooltip when it overflows:</p>

      <div class="example-group">
        <h4>Short Text (No Tooltip)</h4>
        <div
          class="example-container"
          style="width: 300px; border: 1px solid #ddd; padding: 16px;"
        >
          <orcid-text-with-tooltip [text]="shortText">
            <h1 style="margin: 0;">{{ shortText }}</h1>
          </orcid-text-with-tooltip>
        </div>
      </div>

      <div class="example-group">
        <h4>Long Text (Shows Tooltip)</h4>
        <div
          class="example-container"
          style="width: 300px; border: 1px solid #ddd; padding: 16px;"
        >
          <orcid-text-with-tooltip [text]="longText">
            <h1 style="margin: 0;">{{ longText }}</h1>
          </orcid-text-with-tooltip>
        </div>
      </div>

      <div class="example-group">
        <h4>Paragraph Text</h4>
        <div
          class="example-container"
          style="width: 200px; border: 1px solid #ddd; padding: 16px;"
        >
          <orcid-text-with-tooltip [text]="paragraphText">
            <p style="margin: 0;">{{ paragraphText }}</p>
          </orcid-text-with-tooltip>
        </div>
      </div>

      <div class="example-group">
        <h4>Interactive Example</h4>
        <p>
          Enter text below and adjust the container width to see the tooltip
          behavior:
        </p>
        <div class="controls-panel">
          <mat-form-field appearance="outline">
            <mat-label>Text Content</mat-label>
            <input matInput [(ngModel)]="customText" />
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Container Width (px)</mat-label>
            <input matInput type="number" [(ngModel)]="containerWidth" />
          </mat-form-field>
        </div>
        <div
          class="example-container"
          [style.width.px]="containerWidth"
          style="border: 1px solid #ddd; padding: 16px; margin-top: 16px;"
        >
          <orcid-text-with-tooltip [text]="customText">
            <h2 style="margin: 0;">{{ customText || 'Enter some text...' }}</h2>
          </orcid-text-with-tooltip>
        </div>
      </div>
    </section>

    <section class="docs-section">
      <h3>Usage</h3>
      <pre><code>&lt;orcid-text-with-tooltip [text]="myText"&gt;
  &lt;h1&gt;{{ '{{' }} myText {{ '}}' }}&lt;/h1&gt;
&lt;/orcid-text-with-tooltip&gt;</code></pre>

      <h3>Inputs</h3>
      <ul>
        <li>
          <code>text</code>: The text content to display in the tooltip when
          overflow occurs. If not provided, the component will extract text from
          the projected content.
        </li>
      </ul>

      <h3>Behavior</h3>
      <ul>
        <li>
          The tooltip only appears when the text content overflows its container
        </li>
        <li>The tooltip follows the cursor as you move the mouse</li>
        <li>
          The tooltip automatically positions itself to stay within the viewport
        </li>
        <li>
          The component uses ResizeObserver to detect when overflow state
          changes
        </li>
      </ul>
    </section>
  `,
  styles: [
    `
      .docs-section {
        margin-bottom: 48px;
      }

      .docs-section h3 {
        margin-top: 0;
        margin-bottom: 16px;
        color: var(--orcid-color-text, #222);
        font-size: 1.25rem;
        font-weight: 500;
      }

      .docs-section h4 {
        margin-top: 0;
        margin-bottom: 12px;
        color: var(--orcid-color-text, #222);
        font-size: 1.125rem;
        font-weight: 500;
      }

      .docs-section p {
        margin-bottom: 16px;
        color: var(--orcid-color-text-secondary, #666);
        line-height: 1.6;
      }

      .docs-section code {
        background: var(--orcid-surface-subtle, #f5f5f5);
        padding: 2px 6px;
        border-radius: 4px;
        font-family: 'Courier New', monospace;
        font-size: 0.9em;
        color: var(--orcid-color-text, #222);
      }

      .docs-section pre {
        background: var(--orcid-surface-subtle, #f5f5f5);
        padding: 16px;
        border-radius: 8px;
        overflow-x: auto;
        margin: 16px 0;
      }

      .docs-section pre code {
        background: none;
        padding: 0;
      }

      .docs-section ul {
        margin: 16px 0;
        padding-left: 24px;
      }

      .docs-section li {
        margin-bottom: 8px;
        line-height: 1.6;
      }

      .example-group {
        margin-bottom: 32px;
      }

      .example-container {
        margin-top: 16px;
      }

      .controls-panel {
        display: flex;
        gap: 16px;
        flex-wrap: wrap;
        margin-bottom: 16px;
      }

      .controls-panel mat-form-field {
        flex: 1;
        min-width: 200px;
      }
    `,
  ],
})
export class TextWithTooltipPageComponent {
  shortText = 'Short text'
  longText =
    'This is a very long text that will definitely overflow its container and show a tooltip when you hover over it'
  paragraphText =
    'This is a paragraph of text that demonstrates how the tooltip works with longer content that wraps or overflows.'
  customText = 'Custom text that you can edit'
  containerWidth = 300
}
