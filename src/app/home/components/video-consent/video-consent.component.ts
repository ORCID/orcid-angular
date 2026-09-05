import { Component, EventEmitter, Input, Output } from '@angular/core'

import { Video } from '../../../types/homepage-content.v2'
import {
  aspectRatioCss,
  providerLabel,
  providerSite,
  watchUrl,
} from '../video-embed/player-url'

/**
 * What a visitor sees when functional cookies have not been accepted.
 *
 * This is a complete state, not an error. OneTrust rewrites a third-party
 * iframe's `src` to `data-src` until category C0003 is accepted, so the current
 * page leaves a titled, focusable, empty frame behind: a keyboard user tabs
 * into nothing and a screen reader announces a frame containing nothing. Here
 * the visitor gets the poster with its real alt text, a plain sentence saying
 * why the player is absent, a way to open the cookie settings if there are any
 * to open, and a link that always works. The transcript sits below, in the
 * figure, so it is present in this state exactly as it is in the others.
 *
 * It states the reason once and offers a way out. It does not ask twice.
 */
@Component({
  selector: 'app-video-consent',
  standalone: true,
  templateUrl: './video-consent.component.html',
  styleUrls: ['./video-consent.component.scss'],
})
export class VideoConsentComponent {
  @Input({ required: true }) video!: Video

  /**
   * Whether a preference centre exists to open. Defaults to false: when the
   * consent script is blocked or failed, this state is still what renders, and
   * a button that cannot do anything would be worse than no button.
   */
  @Input() canOpenPreferences = false

  /** Asks the host to open the cookie preference centre. */
  @Output() allow = new EventEmitter<void>()

  get aspectRatio(): string {
    return aspectRatioCss(this.video?.aspectRatio)
  }

  /** Null for a provider this build does not know; the link is then omitted. */
  get watchHref(): string | null {
    return watchUrl(this.video)
  }

  get explanation(): string {
    const provider = providerLabel(this.video)
    if (provider === null) {
      return $localize`:@@home.videoConsentExplainUnnamed:Playing this video here needs functional cookies.`
    }
    return $localize`:@@home.videoConsentExplain:This video is hosted by ${provider}:provider:. Playing it here needs functional cookies.`
  }

  get watchLabel(): string {
    const site = providerSite(this.video) ?? ''
    return $localize`:@@home.videoWatchOn:Watch on ${site}:site: (opens in a new tab)`
  }

  readonly preferencesLabel = $localize`:@@home.videoCookieSettings:Cookie settings`
}
