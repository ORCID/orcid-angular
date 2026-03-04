import { Component } from '@angular/core'

@Component({
  selector: 'orcid-orcid-registry-ui',
  standalone: true,
  imports: [],
  template: `
    <section class="orcid-registry-ui-placeholder">
      <h1 class="orc-ui-font-heading">Orcid Registry UI library</h1>
      <p class="orc-ui-font-body">
        This is a placeholder component from <code>@orcid/registry-ui</code>.
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

    .orcid-registry-ui-placeholder h1 {
      margin: 0 0 0.5rem 0;
    }

    .orcid-registry-ui-placeholder p {
      margin: 0;
    }
  `,
})
export class OrcidRegistryUi {}
