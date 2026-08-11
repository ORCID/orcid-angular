import {
  ApplicationConfig,
  ApplicationRef,
  Component,
  DoBootstrap,
  Injector,
} from '@angular/core'
import { bootstrapApplication } from '@angular/platform-browser'
import { createCustomElement } from '@angular/elements'
import { OrcidUi } from '@orcid/ui'

@Component({
  selector: 'orcid-elements-bootstrap',
  standalone: true,
  template: '',
})
export class OrcidElementsBootstrapComponent implements DoBootstrap {
  constructor(private injector: Injector) {}

  ngDoBootstrap(appRef: ApplicationRef): void {
    const placeholder = createCustomElement(OrcidUi, {
      injector: this.injector,
    })

    if (!customElements.get('orcid-ui-placeholder')) {
      customElements.define('orcid-ui-placeholder', placeholder)
    }
  }
}

// No project in angular.json is built with SSR or prerendering, so client
// hydration has nothing to restore. Enabling it only activates the TransferState
// lookup of the `ng-state` element, which is the DOM-clobbering sink behind
// CVE-2026-54267 — bad trade for a bundle that embeds in third-party pages.
export const appConfig: ApplicationConfig = {
  providers: [],
}

export function bootstrapOrcidElements() {
  return bootstrapApplication(OrcidElementsBootstrapComponent, appConfig)
}
