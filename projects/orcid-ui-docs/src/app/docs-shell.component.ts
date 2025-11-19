import { Component } from '@angular/core'
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router'

@Component({
  selector: 'orcid-docs-shell',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './docs-shell.component.html',
  styleUrl: './docs-shell.component.scss',
})
export class DocsShellComponent {}


