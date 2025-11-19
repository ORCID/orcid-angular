import { Component } from '@angular/core'
import { OrcidUi } from '@orcid/ui'

@Component({
  selector: 'orcid-overview-page',
  standalone: true,
  imports: [OrcidUi],
  template: `
    <h2>Overview</h2>
    <p>
      This site documents the <code>@orcid/ui</code> component library and the
      Orcid design tokens from <code>@orcid/tokens</code>.
    </p>

    <section class="docs-section">
      <h3>Library placeholder</h3>
      <p>
        The component below is rendered from <code>@orcid/ui</code> and styled
        using Orcid tokens via CSS custom properties.
      </p>
      <orcid-orcid-ui></orcid-orcid-ui>
    </section>
  `,
})
export class OverviewPageComponent {}


