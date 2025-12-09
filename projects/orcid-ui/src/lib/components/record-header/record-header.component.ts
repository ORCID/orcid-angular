import { Component, EventEmitter, Input, Output } from '@angular/core'
import { NgIf, NgClass } from '@angular/common'
import { MatProgressBarModule } from '@angular/material/progress-bar'
import { MatDividerModule } from '@angular/material/divider'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { MatTooltipModule } from '@angular/material/tooltip'
import { TextWithTooltipComponent } from '../text-with-tooltip/text-with-tooltip.component'
import { AccentButtonDirective } from '../../directives/accent-button.directive'
import { SkeletonPlaceholderComponent } from '../skeleton-placeholder/skeleton-placeholder.component'

@Component({
  selector: 'orcid-header-banner',
  standalone: true,
  imports: [
    NgIf,
    NgClass,
    MatProgressBarModule,
    MatDividerModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    TextWithTooltipComponent,
    AccentButtonDirective,
    SkeletonPlaceholderComponent,
  ],
  templateUrl: './record-header.component.html',
  styleUrls: ['./record-header.component.scss'],
})
export class HeaderBannerComponent {
  @Input() loading = false
  @Input() compactMode = false
  @Input() isDesktop = true

  /**
   * Generic text inputs for the main title and optional subtitle.
   * The feature layer is responsible for composing any domain-specific
   * strings (names, other names, etc) into these.
   */
  @Input() title = ''
  @Input() subtitle = ''
  /**
   * Optional caption text displayed under the subtitle.
   */
  @Input() caption = ''
  @Input() showIssue = false
  @Input() issueTitle = ''

  /**
   * Generic text inputs for the identifier line (e.g. ORCID iD).
   * The feature layer decides what to render on mobile vs desktop.
   */
  @Input() primaryIdText = ''
  @Input() secondaryIdText = ''

  /**
   * Generic expansion state for any collapsible content controlled
   * by this header (e.g. record summary, details, etc).
   */
  @Input() expanded = false
  @Input() canToggleExpanded = false
  @Output() expandedChange = new EventEmitter<boolean>()

  @Input() regionNames = ''
  @Input() regionOrcidId = ''

  /**
   * Main action button configuration
   */
  @Input() mainActionName = ''
  @Output() mainActionClicked = new EventEmitter<void>()

  onToggleExpanded() {
    const next = !this.expanded
    this.expandedChange.emit(next)
  }

  onMainActionClick() {
    this.mainActionClicked.emit()
  }
}
