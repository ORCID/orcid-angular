import { CommonModule } from '@angular/common'
import { Component, EventEmitter, Input, Output } from '@angular/core'
import { MatIconModule } from '@angular/material/icon'
import { MatButtonModule } from '@angular/material/button'
import { MatTooltipModule } from '@angular/material/tooltip'

@Component({
  selector: 'orcid-panel',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatTooltipModule],
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.scss'],
})
export class OrcidPanelComponent {
  @Input() panelId!: string
  @Input() isPreferred = false
  @Input() startToggleOn = false
  @Input() enableStartToggl = false
  @Input() startToggleDisabled = false
  @Input() startToggleTooltip = ''
  @Input() icon?: string
  @Input() iconClass?: string
  @Input() title?: string
  @Input() isMobile = false

  @Output() toggleFeatured = new EventEmitter<void>()

  get showIcon(): boolean {
    return !!this.icon
  }
}
