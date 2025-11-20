import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { MatTooltipModule } from '@angular/material/tooltip'
import { AccentButtonDirective } from '@orcid/ui'

@Component({
  selector: 'orcid-accent-button-page',
  standalone: true,
  imports: [
    CommonModule,
    AccentButtonDirective,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
  ],
  template: `
    <h2>Accent Button Directive</h2>
    <p>
      The <code>AccentButtonDirective</code> applies hover background styling to
      icon buttons. When a button with this directive is hovered, it displays
      the accent color (<code>--brand-secondary-dark</code>).
    </p>

    <section class="docs-section">
      <h3>Examples</h3>
      <p>Hover over the buttons below to see the accent hover effect:</p>

      <div class="example-group">
        <h4>Icon Buttons with Accent Hover</h4>
        <div class="example-container">
          <div class="button-group">
            <button
              mat-icon-button
              accentButton
              matTooltip="Edit"
              aria-label="Edit"
            >
              <mat-icon>edit</mat-icon>
            </button>
            <button
              mat-icon-button
              accentButton
              matTooltip="Copy"
              aria-label="Copy"
            >
              <mat-icon>content_copy</mat-icon>
            </button>
            <button
              mat-icon-button
              accentButton
              matTooltip="Print"
              aria-label="Print"
            >
              <mat-icon>
                <span class="material-symbols-outlined">print</span>
              </mat-icon>
            </button>
            <button
              mat-icon-button
              accentButton
              matTooltip="Delete"
              aria-label="Delete"
            >
              <mat-icon>delete</mat-icon>
            </button>
          </div>
        </div>
      </div>

      <div class="example-group">
        <h4>Without Directive (Default Material Hover)</h4>
        <div class="example-container">
          <div class="button-group">
            <button mat-icon-button matTooltip="Edit" aria-label="Edit">
              <mat-icon>edit</mat-icon>
            </button>
            <button mat-icon-button matTooltip="Copy" aria-label="Copy">
              <mat-icon>content_copy</mat-icon>
            </button>
            <button mat-icon-button matTooltip="Print" aria-label="Print">
              <mat-icon>
                <span class="material-symbols-outlined">print</span>
              </mat-icon>
            </button>
            <button mat-icon-button matTooltip="Delete" aria-label="Delete">
              <mat-icon>delete</mat-icon>
            </button>
          </div>
          <p class="note">
            These buttons use the default Material Design hover behavior for
            comparison.
          </p>
        </div>
      </div>
    </section>

    <section class="docs-section">
      <h3>Usage</h3>
      <p>Apply the <code>accentButton</code> directive to any icon button:</p>
      <pre><code>&lt;button mat-icon-button accentButton matTooltip="Edit"&gt;
  &lt;mat-icon&gt;edit&lt;/mat-icon&gt;
&lt;/button&gt;</code></pre>

      <h3>Styling</h3>
      <p>
        The directive applies the class <code>accent-button</code> to the host
        element, which adds the following hover style:
      </p>
      <pre><code>.accent-button:hover {{ '{' }}
  background: var(--brand-secondary-dark, #085C77) !important;
{{ '}' }}</code></pre>

      <p>
        The color uses the <code>--brand-secondary-dark</code> CSS custom
        property with a fallback value of <code>#085C77</code>.
      </p>

      <h3>CSS Variable</h3>
      <p>
        The directive uses the <code>--brand-secondary-dark</code> variable from
        the Orcid design tokens. This variable is defined in
        <code>@orcid/tokens</code> and should be available globally in your
        application.
      </p>

      <h3>Use Cases</h3>
      <ul>
        <li>
          Icon buttons in headers and navigation that need consistent accent
          hover styling
        </li>
        <li>
          Action buttons that should stand out with the brand secondary color
        </li>
        <li>
          Buttons on colored backgrounds where the default Material hover might
          not be visible
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
        color: var(--orcid-color-text-muted, #666);
        line-height: 1.6;
      }

      .docs-section .note {
        margin-top: 12px;
        font-style: italic;
        color: var(--orcid-color-text-muted, #666);
        font-size: 0.9em;
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

      .button-group {
        display: flex;
        gap: 16px;
        align-items: center;
        padding: 16px;
        border: 1px solid var(--orcid-color-border-subtle, #ddd);
        border-radius: 8px;
        background: var(--orcid-surface, #fff);
      }
    `,
  ],
})
export class AccentButtonPageComponent {}
