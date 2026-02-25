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

      /* Default: accent/dark background — light shimmer (production behavior) */
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

      /* Light/white background — dark shimmer so it’s visible on surface */
      :host.skeleton-placeholder--surface {
        background-color: rgba(0, 0, 0, 0.04);
      }

      :host.skeleton-placeholder--surface::before {
        background: linear-gradient(
          90deg,
          transparent 0%,
          rgba(0, 0, 0, 0.05) 25%,
          rgba(0, 0, 0, 0.10) 50%,
          rgba(0, 0, 0, 0.05) 75%,
          transparent 100%
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
  /**
   * When true (default), shimmer is tuned for accent/dark backgrounds (light shimmer).
   * When false, shimmer is tuned for light/white backgrounds (dark shimmer).
   */
  @Input() accentBackground = true

  @HostBinding('class') get hostClasses(): string {
    const shapeClass = this.shape
    const surfaceClass =
      !this.accentBackground ? 'skeleton-placeholder--surface' : ''
    return [shapeClass, surfaceClass].filter(Boolean).join(' ')
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
