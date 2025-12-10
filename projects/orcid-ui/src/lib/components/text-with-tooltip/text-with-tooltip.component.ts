import {
  Component,
  Input,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnChanges,
  SimpleChanges,
  OnDestroy,
  HostListener,
  ChangeDetectorRef,
  HostBinding,
} from '@angular/core'
import { CommonModule, NgIf } from '@angular/common'
import { SkeletonPlaceholderComponent } from '../skeleton-placeholder/skeleton-placeholder.component'

/**
 * A reusable component that displays text with a tooltip that only appears
 * when the text overflows its container.
 *
 * @example
 * ```html
 * <orcid-text-with-tooltip [text]="myLongText">
 *   <h1>{{ myLongText }}</h1>
 * </orcid-text-with-tooltip>
 * ```
 */
@Component({
  selector: 'orcid-text-with-tooltip',
  standalone: true,
  imports: [CommonModule, NgIf, SkeletonPlaceholderComponent],
  template: `
    <span
      *ngIf="!loading"
      #wrapperRef
      (mouseenter)="onMouseEnter($event)"
      (mousemove)="onMouseMove($event)"
      (mouseleave)="onMouseLeave()"
      class="text-wrapper"
    >
      <ng-content></ng-content>
    </span>
    <orcid-skeleton-placeholder
      *ngIf="loading && !hiddenSkeleton"
      [shape]="skeletonShape"
      [width]="skeletonWidth"
      [height]="textHeightSkeleton"
    ></orcid-skeleton-placeholder>
    <div
      *ngIf="showCustomTooltip"
      class="custom-tooltip"
      [style.left.px]="tooltipX"
      [style.top.px]="tooltipY"
    >
      {{ tooltipText }}
    </div>
  `,
  styles: [
    `
      :host {
        max-width: 100%;
        min-width: 0;
        vertical-align: middle;
        line-height: normal; /* Changed from 0 to normal to respect min-height */
      }

      .text-wrapper {
        display: inline-block;
        max-width: 100%;
        min-width: 0;
        line-height: normal;
      }

      .text-wrapper ::ng-deep > * {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        max-width: 100%;
      }

      .custom-tooltip {
        position: fixed;
        z-index: 10000;
        background-color: rgba(0, 0, 0, 0.87);
        color: white;
        padding: 8px 12px;
        border-radius: 4px;
        font-size: 12px;
        max-width: 300px;
        word-wrap: break-word;
        white-space: normal;
        pointer-events: none;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        transform: translate(10px, 10px);
        line-height: normal;
      }
    `,
  ],
})
export class TextWithTooltipComponent
  implements AfterViewInit, OnChanges, OnDestroy
{
  /**
   * The text content to display in the tooltip when overflow occurs.
   * If not provided, the component will attempt to extract text from
   * the projected content.
   */
  @Input() text = ''
  @Input() loading = false
  @Input() skeletonShape: 'square' | 'circle' = 'square'
  @Input() skeletonWidth = '100%'
  @Input() textHeightSkeleton = 'auto'
  @Input() height = 'auto'
  @Input() center = false
  @Input() hiddenSkeleton = false

  @ViewChild('wrapperRef', { read: ElementRef, static: false })
  wrapperElement?: ElementRef<HTMLElement>

  overflows = false
  private resizeObserver?: ResizeObserver
  showCustomTooltip = false
  tooltipX = 0
  tooltipY = 0

  constructor(private cdr: ChangeDetectorRef) {}

  ngAfterViewInit() {
    // Use requestAnimationFrame to ensure DOM is fully rendered
    requestAnimationFrame(() => {
      this.checkOverflow()
      this.setupResizeObserver()
      this.cdr.detectChanges()
    })
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['text'] || changes['loading']) {
      // Use setTimeout to ensure DOM has updated
      setTimeout(() => {
        this.checkOverflow()
        this.setupResizeObserver()
      }, 0)
    } else {
      // Check overflow on any change to catch content updates
      setTimeout(() => {
        this.checkOverflow()
      }, 0)
    }
  }

  ngOnDestroy() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect()
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkOverflow()
  }

  private setupResizeObserver() {
    if (typeof ResizeObserver === 'undefined') {
      return
    }

    // Disconnect existing observer if it exists
    if (this.resizeObserver) {
      this.resizeObserver.disconnect()
    }

    // Create new observer
    this.resizeObserver = new ResizeObserver(() => {
      this.checkOverflow()
    })

    // Observe both the wrapper and the content element
    const wrapper = this.wrapperElement?.nativeElement
    if (wrapper) {
      this.resizeObserver.observe(wrapper)

      // Also observe the first child (content element) if it exists
      const contentElement = wrapper.firstElementChild as HTMLElement
      if (contentElement) {
        this.resizeObserver.observe(contentElement)
      }
    }
  }

  checkOverflow() {
    const wrapper = this.wrapperElement?.nativeElement
    if (!wrapper) {
      this.overflows = false
      return
    }

    // Check overflow on the first child element (the actual content)
    const contentElement = wrapper.firstElementChild as HTMLElement

    if (contentElement) {
      // Check if the content overflows by comparing scrollWidth to clientWidth
      // scrollWidth gives the full width including overflowed content
      // clientWidth gives the visible width
      const wasOverflowing = this.overflows
      this.overflows = contentElement.scrollWidth > contentElement.clientWidth

      // Trigger change detection if overflow state changed
      if (wasOverflowing !== this.overflows) {
        this.cdr.detectChanges()
      }
    } else {
      // If no child element, check the wrapper itself
      const wasOverflowing = this.overflows
      this.overflows = wrapper.scrollWidth > wrapper.clientWidth

      if (wasOverflowing !== this.overflows) {
        this.cdr.detectChanges()
      }
    }
  }

  get tooltipText(): string {
    if (this.text) {
      return this.text
    }

    // Fallback: try to extract text from the wrapper element
    const element = this.wrapperElement?.nativeElement
    return element?.textContent?.trim() || ''
  }

  get shouldShowTooltip(): boolean {
    return !this.loading && this.overflows && !!this.tooltipText
  }

  @HostBinding('style.width')
  get hostWidth(): string {
    return this.loading ? '100%' : 'auto'
  }

  @HostBinding('style.min-height')
  get hostMinHeight(): string {
    return this.height !== 'auto' ? this.height : '0'
  }

  @HostBinding('style.display')
  get hostDisplay(): string {
    // Flex display for centering if needed, otherwise inline-block
    if (this.loading) {
      return 'flex' // Always use flex when loading to enable vertical centering
    }
    return this.tooltipText ? (this.center ? 'flex' : 'inline-block') : 'none'
  }

  @HostBinding('style.justify-content')
  get hostJustifyContent(): string {
    return this.center ? 'center' : 'normal'
  }

  @HostBinding('style.align-items')
  get hostAlignItems(): string {
    // Always center vertically if flex
    return this.center || this.loading ? 'center' : 'normal'
  }

  @HostBinding('class.has-text')
  get hasTextClass(): boolean {
    return !!this.tooltipText || this.loading
  }

  onMouseEnter(event: MouseEvent) {
    if (this.shouldShowTooltip) {
      this.updateTooltipPosition(event)
      this.showCustomTooltip = true
      this.cdr.detectChanges()
    }
  }

  onMouseMove(event: MouseEvent) {
    if (this.showCustomTooltip) {
      this.updateTooltipPosition(event)
      this.cdr.detectChanges()
    }
  }

  onMouseLeave() {
    this.showCustomTooltip = false
    this.cdr.detectChanges()
  }

  private updateTooltipPosition(event: MouseEvent) {
    // Position tooltip offset from cursor (10px right and 10px down)
    this.tooltipX = event.clientX + 10
    this.tooltipY = event.clientY + 10

    // Adjust if tooltip would go off screen
    const tooltipWidth = 300 // max-width from CSS
    const tooltipHeight = 100 // estimated max height
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight

    // If tooltip would overflow right, position to the left of cursor
    if (this.tooltipX + tooltipWidth > viewportWidth) {
      this.tooltipX = event.clientX - tooltipWidth - 10
    }

    // If tooltip would overflow bottom, position above cursor
    if (this.tooltipY + tooltipHeight > viewportHeight) {
      this.tooltipY = event.clientY - tooltipHeight - 10
    }

    // Ensure tooltip doesn't go off left or top
    if (this.tooltipX < 10) {
      this.tooltipX = 10
    }
    if (this.tooltipY < 10) {
      this.tooltipY = 10
    }
  }
}
