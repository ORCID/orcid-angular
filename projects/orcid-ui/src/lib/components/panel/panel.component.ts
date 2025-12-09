import { CommonModule } from '@angular/common'
import { Component, EventEmitter, Input, Output } from '@angular/core'
import { MatIconModule } from '@angular/material/icon'

@Component({
  selector: 'orcid-panel',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.scss'],
})
export class OrcidPanelComponent {
  @Input() panelId!: string
  @Input() type:
    | 'affiliations'
    | 'employment'
    | 'professional-activities'
    | 'invited-position'
    | 'distinction'
    | 'membership'
    | 'service'
    | 'editorial-service' = 'affiliations'
  @Input() openState = true
  @Input() isPreferred = false
  @Input() isFeatured = false
  @Input() isPublicRecord = false
  @Input() hasExternalIds = false
  @Input() userVersionPresent = false
  @Input() displayTheStack = false
  @Input() icon?: string
  @Input() iconClass?: string
  @Input() title?: string
  @Input() isMobile = false

  get isAffiliation(): boolean {
    return (
      this.type === 'employment' ||
      this.type === 'affiliations' ||
      this.type === 'invited-position' ||
      this.type === 'distinction' ||
      this.type === 'membership' ||
      this.type === 'service' ||
      this.type === 'editorial-service' ||
      this.type === 'professional-activities'
    )
  }

  @Output() displayTheStackChange = new EventEmitter<boolean>()
  @Output() openStateChange = new EventEmitter<boolean>()
  @Output() toggleFeatured = new EventEmitter<void>()

  get showIcon(): boolean {
    return !!this.icon
  }

  toggle() {
    this.openState = !this.openState
    this.openStateChange.emit(this.openState)
  }

  showStackToggle(): boolean {
    return (
      this.hasExternalIds && this.userVersionPresent && !this.isPublicRecord
    )
  }
}
