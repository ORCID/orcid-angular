import { Component, EventEmitter, Input, Output } from '@angular/core'
import { NgIf } from '@angular/common'
import { MatButtonModule } from '@angular/material/button'

@Component({
  selector: 'orcid-step-view',
  standalone: true,
  imports: [NgIf, MatButtonModule],
  templateUrl: './step-view.component.html',
  styleUrls: ['./step-view.component.scss'],
})
export class OrcidStepViewComponent {
  /** Main title displayed at the top of the step view. */
  @Input() title = ''

  /** Optional subtitle shown below title (e.g. Step 1 of 2). */
  @Input() subtitle = ''

  /** Show ORCID icon block in header. */
  @Input() showHeaderIcon = true

  /** Header icon source path. */
  @Input() headerIconSrc = 'assets/vectors/orcid.logo.icon.svg'

  /** Header icon alt text. */
  @Input() headerIconAlt = 'orcid logo'

  /** Optional text for the primary action button. */
  @Input() primaryLabel = ''

  /** Disables the primary action button when true. */
  @Input() primaryDisabled = false

  /** Whether footer buttons should fill the container width. */
  @Input() fullWidthActions = true

  @Output() primaryAction = new EventEmitter<void>()
}
