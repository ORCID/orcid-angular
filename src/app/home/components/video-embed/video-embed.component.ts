import { DOCUMENT } from '@angular/common'
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  Input,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core'
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser'

import { Video } from '../../../types/homepage-content.v2'
import { DisclosureComponent } from '../disclosure/disclosure.component'
import {
  InlineNode,
  LinkNode,
  Paragraph,
  parseMarkdownLite,
} from '../rich-text/markdown-lite'
import { VideoConsentComponent } from '../video-consent/video-consent.component'
import { aspectRatioCss, isPlayable, trustedPlayerUrl } from './player-url'

/**
 * The OneTrust category for functional cookies, which is the one a third-party
 * player needs. Until it is accepted OneTrust rewrites an iframe's `src` to
 * `data-src`, so a frame rendered before consent is an empty box that a
 * keyboard user can still tab into.
 */
const FUNCTIONAL_COOKIES = 'C0003'

interface OneTrustWindow extends Window {
  /** A comma-delimited list such as `,C0001,C0003,`. */
  OnetrustActiveGroups?: unknown
  OneTrust?: { ToggleInfoDisplay?: () => void }
}

/**
 * A video with a poster facade in front of it.
 *
 * The iframe does not exist until the visitor asks for it, for two independent
 * reasons that happen to want the same design. Consent: OneTrust will not let a
 * third-party frame load until functional cookies are accepted, and an
 * unloadable frame is a 1.1.1 and 4.1.2 failure produced by someone else
 * mutating our DOM. Performance: the current page opens a connection to
 * player.vimeo.com during first paint, for a video most visitors never play.
 *
 * Because nothing loads without a click, `allow` never mentions autoplay and
 * the autoplay parameter only ever appears in a URL built inside `play()`.
 * Focus follows the click into the player, which is a context change the user
 * asked for, so SC 3.2.2 is satisfied rather than merely avoided.
 */
@Component({
  selector: 'app-video-embed',
  standalone: true,
  imports: [DisclosureComponent, VideoConsentComponent],
  templateUrl: './video-embed.component.html',
  styleUrls: ['./video-embed.component.scss'],
})
export class VideoEmbedComponent implements OnInit {
  private readonly sanitizer = inject(DomSanitizer)
  private readonly changeDetector = inject(ChangeDetectorRef)
  private readonly window = inject(DOCUMENT)
    .defaultView as OneTrustWindow | null

  @ViewChild('player') private player?: ElementRef<HTMLIFrameElement>

  /** True only after the visitor clicks play. Never set from content. */
  playing = false
  playerUrl: SafeResourceUrl | null = null

  /**
   * Withheld until proven granted. When the consent script is blocked or fails
   * to load, consent never resolves, and the honest answer to "may we load a
   * third-party frame" is no.
   */
  consented = false

  transcript: Paragraph[] = []
  aspectRatio = aspectRatioCss(undefined)
  playable = false
  playLabel = ''
  frameTitle = ''
  durationLabel: string | null = null

  readonly transcriptLabel = $localize`:@@home.videoTranscript:Read the transcript`

  private _video!: Video

  @Input({ required: true })
  set video(value: Video) {
    this._video = value
    this.transcript = parseMarkdownLite(value?.transcript ?? '')
    this.aspectRatio = aspectRatioCss(value?.aspectRatio)
    this.playable = isPlayable(value)
    this.durationLabel = formatDuration(value?.durationSeconds)

    const title = value?.title ?? ''
    // Never the bare word "Play": in a list of videos every button would then
    // have the same accessible name.
    this.playLabel = $localize`:@@home.playVideo:Play video: ${title}:title:`
    // The video's own title, not the section heading the current code binds:
    // two videos in one section would otherwise share a frame title, which axe
    // reports as frame-title-unique.
    this.frameTitle = $localize`:@@home.videoFrameTitle:${title}:title: (video)`

    // A new video means a new player; whatever was playing is not it.
    this.playing = false
    this.playerUrl = null
  }

  get video(): Video {
    return this._video
  }

  ngOnInit(): void {
    this.consented = this.readConsent()
  }

  /**
   * OneTrust dispatches this on the window whenever the visitor's choices
   * change, including the first time they are made, so a visitor who accepts
   * cookies gets the player without reloading the page.
   */
  @HostListener('window:OneTrustGroupsUpdated')
  onConsentChanged(): void {
    this.consented = this.readConsent()
  }

  /** Whether there is a preference centre to open, rather than a dead button. */
  get canOpenPreferences(): boolean {
    return typeof this.window?.OneTrust?.ToggleInfoDisplay === 'function'
  }

  openPreferenceCentre(): void {
    this.window?.OneTrust?.ToggleInfoDisplay?.()
  }

  play(): void {
    const url = trustedPlayerUrl(this.video, this.sanitizer, { autoplay: true })
    if (url === null) {
      // A videoId the provider's pattern rejects gets no player at all; a
      // guessed URL would be worse than a poster.
      return
    }

    this.playerUrl = url
    this.playing = true

    // The iframe has to exist before it can take focus, and the visitor asked
    // for it by clicking, so moving focus here is expected rather than a
    // change of context on its own.
    this.changeDetector.detectChanges()
    this.player?.nativeElement.focus()
  }

  private readConsent(): boolean {
    const groups = this.window?.OnetrustActiveGroups
    if (typeof groups !== 'string') {
      return false
    }
    // The global is a comma-delimited list such as `,C0001,C0003,`, so an exact
    // segment match is the only safe test: `C0003` is a prefix of nothing today
    // but the list is not ours to depend on.
    return groups.split(',').indexOf(FUNCTIONAL_COOKIES) !== -1
  }

  /**
   * Narrows a node to a link for the template. Angular does not narrow a union
   * through a binding expression, so the narrowing comes back as a value.
   */
  asLink(node: InlineNode): LinkNode | null {
    return node.type === 'link' ? node : null
  }
}

/** `m:ss`, or `h:mm:ss` past an hour. Null when there is no usable duration. */
function formatDuration(seconds: number | undefined): string | null {
  if (
    typeof seconds !== 'number' ||
    !Number.isFinite(seconds) ||
    seconds <= 0
  ) {
    return null
  }

  const total = Math.round(seconds)
  const hours = Math.floor(total / 3600)
  const minutes = Math.floor((total % 3600) / 60)
  const secs = total % 60
  const pad = (value: number) => (value < 10 ? `0${value}` : `${value}`)

  return hours > 0
    ? `${hours}:${pad(minutes)}:${pad(secs)}`
    : `${minutes}:${pad(secs)}`
}
