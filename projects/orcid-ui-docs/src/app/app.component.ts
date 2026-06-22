import { Component, ChangeDetectionStrategy } from '@angular/core'
import { DocsShellComponent } from './docs-shell.component'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [DocsShellComponent],
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './app.component.scss',
})
export class AppComponent {}
