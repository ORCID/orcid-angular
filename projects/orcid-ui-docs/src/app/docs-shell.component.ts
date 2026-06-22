import { Component, ChangeDetectionStrategy } from '@angular/core'
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router'

@Component({
  selector: 'orcid-docs-shell',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './docs-shell.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './docs-shell.component.scss',
})
export class DocsShellComponent {}
