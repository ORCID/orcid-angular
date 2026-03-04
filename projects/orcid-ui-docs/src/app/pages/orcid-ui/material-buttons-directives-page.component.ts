import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { MatTooltipModule } from '@angular/material/tooltip'
import {
  AccentButtonDirective,
  BrandSecondaryDarkButtonDirective,
  UnderlineButtonDirective,
} from '@orcid/ui'

@Component({
  selector: 'orcid-material-buttons-directives-page',
  standalone: true,
  imports: [
    CommonModule,
    AccentButtonDirective,
    BrandSecondaryDarkButtonDirective,
    UnderlineButtonDirective,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
  ],
  template: `
    <h2>Material Buttons Directives</h2>
    <p>
      The Orcid UI library provides several directives to style Material buttons
      with brand colors and consistent styling.
    </p>

    <section class="docs-section">
      <h3>Accent Button Directive</h3>
      <p>
        The <code>accentButton</code> directive applies hover background styling
        to icon buttons. When a button with this directive is hovered, it
        displays the accent color (<code>--brand-secondary-dark</code>).
      </p>

      <div class="example-group">
        <h4>Icon Buttons with Accent Hover</h4>
        <div class="example-container">
          <div class="button-group accent-bg">
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

      <h4>Usage</h4>
      <pre><code>&lt;button mat-icon-button accentButton matTooltip="Edit"&gt;
  &lt;mat-icon&gt;edit&lt;/mat-icon&gt;
&lt;/button&gt;</code></pre>
    </section>

    <section class="docs-section">
      <h3>Brand Secondary Dark Button Directive</h3>
      <p>
        The <code>orcidBrandSecondaryDarkButton</code> directive styles filled
        buttons with the brand secondary dark color. It sets the background,
        text color, and border to match the Orcid brand.
      </p>

      <div class="example-group">
        <h4>Filled Button with Brand Color</h4>
        <div class="example-container">
          <div class="button-group">
            <button mat-flat-button orcidBrandSecondaryDarkButton>
              Connect now
            </button>
            <button mat-flat-button orcidBrandSecondaryDarkButton>
              Submit
            </button>
          </div>
        </div>
      </div>

      <h4>Usage</h4>
      <pre><code>&lt;button mat-flat-button orcidBrandSecondaryDarkButton&gt;
  Connect now
&lt;/button&gt;</code></pre>
    </section>

    <section class="docs-section">
      <h3>Underline Button Directive</h3>
      <p>
        The <code>orcidUnderlineButton</code> directive styles text buttons with
        an underline and brand secondary dark color. Commonly used for "Read" or
        secondary action buttons.
      </p>

      <div class="example-group">
        <h4>Text Button with Underline</h4>
        <div class="example-container">
          <div class="button-group">
            <button mat-button orcidUnderlineButton>Read</button>
            <button mat-button orcidUnderlineButton>Learn more</button>
          </div>
        </div>
      </div>

      <h4>Usage</h4>
      <pre><code>&lt;button mat-button orcidUnderlineButton&gt;Read&lt;/button&gt;</code></pre>
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

      .button-group.accent-bg {
        background: var(--orcid-color-brand-secondary-darkest);
      }
    `,
  ],
})
export class MaterialButtonsDirectivesPageComponent {}
