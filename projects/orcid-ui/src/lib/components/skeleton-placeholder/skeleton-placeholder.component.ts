import { Component, Input, HostBinding } from '@angular/core'
import { CommonModule } from '@angular/common'

@Component({
  selector: 'orcid-skeleton-placeholder',
  standalone: true,
  imports: [CommonModule],
  template: '',
  styles: [
    `
      :host {
        display: block;
        background-color: rgba(255, 255, 255, 0.2);
        animation: pulse 1.5s infinite ease-in-out;
      }

      :host.circle {
        border-radius: 50%;
      }

      :host.square {
        border-radius: 4px;
      }

      @keyframes pulse {
        0% {
          opacity: 0.6;
        }
        50% {
          opacity: 0.3;
        }
        100% {
          opacity: 0.6;
        }
      }
    `,
  ],
})
export class SkeletonPlaceholderComponent {
  @Input() shape: 'square' | 'circle' = 'square'
  @Input() width = '100%'
  @Input() height = '100%'

  @HostBinding('class') get hostClasses() {
    return this.shape
  }

  @HostBinding('style.width') get hostWidth() {
    return this.width
  }

  @HostBinding('style.height') get hostHeight() {
    return this.height
  }
}
