import { Component, signal, ChangeDetectionStrategy } from '@angular/core'
import { AppComponent } from './app.component'

@Component({
  selector: 'app-root-entry',
  standalone: true,
  imports: [AppComponent],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `<app-root />`,
})
export class App {
  protected readonly title = signal('orcid-ui-docs')
}
