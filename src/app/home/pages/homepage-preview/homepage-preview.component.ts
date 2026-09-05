import {
  DOCUMENT,
  Component,
  Inject,
  NgZone,
  OnDestroy,
  OnInit,
} from '@angular/core'

import { WINDOW } from 'src/app/cdk/window'
import {
  HomepageContent,
  isSupportedHomepageContent,
} from 'src/app/types/homepage-content'

const READY_MESSAGE = 'orcid-homepage-preview-ready'

/** What the content editor sends when the draft changes. */
interface PreviewMessage {
  type: 'orcid-homepage-preview'
  content: unknown
}

/**
 * Renders a draft of the homepage, fed from outside the app.
 *
 * The content editor embeds this route in an iframe and posts the entry as the
 * author types. The point is that there is exactly one renderer: what the
 * editor previews is drawn by the same components that draw orcid.org, so the
 * preview cannot drift from the page the way a hand-written copy of the markup
 * would.
 *
 * Only the sections an editor can change are drawn. The header, footer and news
 * feed are not part of the content bundle and would only add noise, and calls
 * to a backend the preview does not need.
 */
@Component({
  selector: 'app-homepage-preview',
  templateUrl: './homepage-preview.component.html',
  styleUrls: ['./homepage-preview.component.scss'],
  standalone: false,
})
export class HomepagePreviewComponent implements OnInit, OnDestroy {
  content?: HomepageContent
  /** Shown until the first draft arrives, and when one cannot be rendered. */
  problem?: string

  private listener = (event: MessageEvent) => this.receive(event)

  constructor(
    @Inject(WINDOW) private window: Window,
    @Inject(DOCUMENT) private document: Document,
    private zone: NgZone
  ) {}

  ngOnInit(): void {
    this.window.addEventListener('message', this.listener)
    // The editor holds the draft, so ask for it rather than waiting for the
    // next keystroke.
    // Announce to both, for the same reason.
    this.window.parent?.postMessage({ type: READY_MESSAGE }, '*')
    if (this.window.top !== this.window.parent) {
      this.window.top?.postMessage({ type: READY_MESSAGE }, '*')
    }
    this.document.body.classList.add('homepage-preview-body')
  }

  ngOnDestroy(): void {
    this.window.removeEventListener('message', this.listener)
    this.document.body.classList.remove('homepage-preview-body')
  }

  private receive(event: MessageEvent): void {
    // Only an embedder speaks here, and only a document this build can render
    // is accepted. The editor nests this route two frames deep, so the sender
    // is the immediate parent or the outermost window depending on how the
    // preview pane is built. Content is drawn by components, never as HTML, so
    // a message that slips through can do nothing but fail to display.
    if (
      event.source !== this.window.parent &&
      event.source !== this.window.top
    ) {
      return
    }

    const message = event.data as PreviewMessage | null
    if (!message || message.type !== 'orcid-homepage-preview') {
      return
    }

    this.zone.run(() => {
      if (isSupportedHomepageContent(message.content)) {
        this.content = message.content
        this.problem = undefined
      } else {
        this.content = undefined
        this.problem =
          'This draft is missing something the page needs, so it cannot be shown yet. Check that every tab has a label, an introduction and two features.'
      }
    })
  }
}
