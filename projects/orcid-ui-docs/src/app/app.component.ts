import { Component } from '@angular/core'
import { DocsShellComponent } from './docs-shell.component'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [DocsShellComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {}
