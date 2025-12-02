import {
  ApplicationConfig,
  ApplicationRef,
  Component,
  DoBootstrap,
  Injector,
} from '@angular/core'
import {
  bootstrapApplication,
  provideClientHydration,
} from '@angular/platform-browser'
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

export const appConfig: ApplicationConfig = {
  providers: [provideClientHydration()],
}

export function bootstrapOrcidElements() {
  return bootstrapApplication(OrcidElementsBootstrapComponent, appConfig)
}
