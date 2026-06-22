import {
  ApplicationConfig,
  ApplicationRef,
  Component,
  DoBootstrap,
  Injector,
  provideZoneChangeDetection,
  ChangeDetectionStrategy,
} from '@angular/core'
import {
  bootstrapApplication,
  provideClientHydration,
  withNoIncrementalHydration,
} from '@angular/platform-browser'
import { createCustomElement } from '@angular/elements'
import { OrcidUi } from '@orcid/ui'

@Component({
  selector: 'orcid-elements-bootstrap',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.Eager,
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
  providers: [provideClientHydration(withNoIncrementalHydration())],
}

export function bootstrapOrcidElements() {
  return bootstrapApplication(OrcidElementsBootstrapComponent, {
    ...appConfig,
    providers: [provideZoneChangeDetection(), ...appConfig.providers],
  })
}
