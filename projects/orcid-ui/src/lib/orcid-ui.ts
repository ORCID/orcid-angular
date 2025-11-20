import { Component } from '@angular/core'

@Component({
  selector: 'orcid-orcid-ui',
  standalone: true,
  imports: [],
  template: `
    <section class="orcid-ui-placeholder">
      <h1 class="orc-ui-font-heading">Orcid UI library</h1>
      <p class="orc-ui-font-body">
        This is a placeholder component from <code>@orcid/ui</code>.
      </p>
    </section>
  `,
  styles: `
    :host {
      display: block;
      padding: 1.5rem;
      background: var(--orcid-surface-subtle, #f5f5f5);
      color: var(--orcid-color-text, #222);
    }

    .orcid-ui-placeholder h1 {
      margin: 0 0 0.5rem 0;
    }

    .orcid-ui-placeholder p {
      margin: 0;
    }
  `,
})
export class OrcidUi {}
