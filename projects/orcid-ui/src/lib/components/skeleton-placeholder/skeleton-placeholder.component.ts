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
        background-color: rgba(255, 255, 255, 0.01);
        position: relative;
        overflow: hidden;
      }

      :host::before {
        content: '';
        position: absolute;
        top: var(--shimmer-top, 0);
        left: var(--shimmer-left, 0);
        width: var(--shimmer-width, 100%);
        height: var(--shimmer-height, 100%);
        background: linear-gradient(
          90deg,
          rgba(255, 255, 255, 0.08) 0%,
          rgba(255, 255, 255, 0.08) 30%,
          rgba(255, 255, 255, 0.12) 50%,
          rgba(255, 255, 255, 0.08) 70%,
          rgba(255, 255, 255, 0.08) 100%
        );
        background-size: 200% 100%;
        animation: shimmer 2s infinite ease-in-out;
      }

      :host.circle {
        border-radius: 50%;
      }

      :host.circle::before {
        border-radius: 50%;
      }

      :host.square {
        border-radius: 4px;
      }

      :host.square::before {
        border-radius: 4px;
      }

      @keyframes shimmer {
        0% {
          background-position: -200% 0;
        }
        100% {
          background-position: 200% 0;
        }
      }
    `,
  ],
})
export class SkeletonPlaceholderComponent {
  @Input() shape: 'square' | 'circle' = 'square'
  @Input() width = '100%'
  @Input() height = '100%'
  @Input() shimmerPercentage = 100

  @HostBinding('class') get hostClasses() {
    return this.shape
  }

  @HostBinding('style.width') get hostWidth() {
    return this.width
  }

  @HostBinding('style.height') get hostHeight() {
    return this.height
  }

  @HostBinding('style.--shimmer-width') get shimmerWidth() {
    return `${this.shimmerPercentage}%`
  }

  @HostBinding('style.--shimmer-left') get shimmerLeft() {
    return `${(100 - this.shimmerPercentage) / 2}%`
  }

  @HostBinding('style.--shimmer-height') get shimmerHeight() {
    return `${this.shimmerPercentage}%`
  }

  @HostBinding('style.--shimmer-top') get shimmerTop() {
    return `${(100 - this.shimmerPercentage) / 2}%`
  }
}
