import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser'

import {
  AspectRatio,
  Video,
  VideoProvider,
} from '../../../types/homepage-content.v2'

/**
 * Video URL assembly for the two providers the catalogue allows.
 *
 * This module mirrors `videoProviders` in CMS/schema/catalogue.json. The
 * content bundle never carries a URL: it carries a provider name and an id, and
 * every URL a visitor's browser reaches is built here from a constant template
 * plus an id that matched the provider's own pattern. That is the whole reason
 * it is safe to hand the result to `bypassSecurityTrustResourceUrl` — the only
 * place the homepage bypasses Angular's sanitiser. An id that does not match
 * yields `null`, so a typo renders no player rather than an arbitrary URL.
 *
 * Replaces `../../pipes/vimeo-embed-url.ts`, which knew only Vimeo. The live
 * page embeds the Vimeo copy of a video whose YouTube copy it also links to, so
 * one provider was never enough to describe what is already published.
 */

interface Provider {
  /** The provider's own name, for the consent panel's explanation. */
  label: string
  /** The site a viewer is sent to when they cannot, or will not, play here. */
  site: string
  /** Narrow enough that a matching id cannot carry a path, query or scheme. */
  pattern: RegExp
  embed(id: string, autoplay: boolean, start?: number): string
  watch(id: string): string
}

const PROVIDERS: Record<VideoProvider, Provider> = {
  vimeo: {
    label: 'Vimeo',
    site: 'vimeo.com',
    pattern: /^[0-9]{1,20}$/,
    // `dnt=1` asks Vimeo not to track the viewer; `title=0` keeps the player
    // chrome out of the way of the caption we render ourselves.
    embed: (id, autoplay, start) =>
      `https://player.vimeo.com/video/${id}` +
      `?dnt=1&title=0&autoplay=${autoplay ? 1 : 0}` +
      (start === undefined ? '' : `#t=${start}s`),
    watch: (id) => `https://vimeo.com/${id}`,
  },
  youtube: {
    label: 'YouTube',
    site: 'youtube.com',
    pattern: /^[A-Za-z0-9_-]{11}$/,
    // The `-nocookie` host is the one on the catalogue's allowlist.
    // `cc_load_policy=1` turns captions on by default, which is the point of
    // requiring them.
    embed: (id, autoplay, start) =>
      `https://www.youtube-nocookie.com/embed/${id}` +
      `?rel=0&modestbranding=1&cc_load_policy=1&autoplay=${autoplay ? 1 : 0}` +
      (start === undefined ? '' : `&start=${start}`),
    watch: (id) => `https://www.youtube.com/watch?v=${id}`,
  },
}

/** Aspect ratios the catalogue allows, as CSS `aspect-ratio` values. */
const ASPECT_RATIOS: Record<AspectRatio, string> = {
  '16:9': '16 / 9',
  '4:3': '4 / 3',
  '1:1': '1 / 1',
  '9:16': '9 / 16',
}

/**
 * Looks a provider up by name without trusting the name.
 *
 * `video.provider` is typed, but it arrives as JSON, so a bundle published from
 * a newer catalogue can name a provider this build has never heard of. An index
 * lookup on a plain object would also answer for `constructor` or `toString`.
 */
function providerFor(video: Video | null | undefined): Provider | null {
  const name = video?.provider
  if (typeof name !== 'string') return null
  if (!Object.prototype.hasOwnProperty.call(PROVIDERS, name)) return null
  return PROVIDERS[name as VideoProvider]
}

/** The start offset, or undefined when there is nothing usable to apply. */
function startSeconds(video: Video): number | undefined {
  const start = video.startAt
  if (typeof start !== 'number') return undefined
  if (!Number.isInteger(start) || start <= 0) return undefined
  return start
}

export interface PlayerUrlOptions {
  /**
   * Only ever true for a URL built inside a click handler. Content cannot set
   * it: nothing on the page plays until a visitor asks it to, which is why
   * `prefers-reduced-motion` has no autoplay to suppress here.
   */
  autoplay?: boolean
}

/** Whether this build can build a player URL for the video at all. */
export function isPlayable(video: Video | null | undefined): boolean {
  const provider = providerFor(video)
  return (
    provider !== null &&
    typeof video?.videoId === 'string' &&
    provider.pattern.test(video.videoId)
  )
}

/**
 * The player URL as a plain string, or null when the id does not match the
 * provider's pattern. Exported separately from the trusted form so it can be
 * asserted character by character in a test.
 */
export function playerEmbedUrl(
  video: Video | null | undefined,
  options: PlayerUrlOptions = {}
): string | null {
  const provider = providerFor(video)
  if (!provider || !video) return null
  if (typeof video.videoId !== 'string') return null
  if (!provider.pattern.test(video.videoId)) return null

  return provider.embed(
    video.videoId,
    options.autoplay === true,
    startSeconds(video)
  )
}

/**
 * The player URL in the form an `[src]` binding accepts.
 *
 * The bypass is safe here and nowhere else: the argument is not content, it is
 * a constant template filled with an id that passed a pattern admitting only
 * digits or eleven URL-safe characters.
 */
export function trustedPlayerUrl(
  video: Video | null | undefined,
  sanitizer: DomSanitizer,
  options: PlayerUrlOptions = {}
): SafeResourceUrl | null {
  const url = playerEmbedUrl(video, options)
  return url === null ? null : sanitizer.bypassSecurityTrustResourceUrl(url)
}

/**
 * The page for the video on the provider's own site. Always available, even
 * when the embed is not, which is what makes the consent state useful rather
 * than apologetic.
 */
export function watchUrl(video: Video | null | undefined): string | null {
  const provider = providerFor(video)
  if (!provider || !video || typeof video.videoId !== 'string') return null
  if (!provider.pattern.test(video.videoId)) return null
  return provider.watch(video.videoId)
}

/** The provider's display name, e.g. `Vimeo`. Null for an unknown provider. */
export function providerLabel(video: Video | null | undefined): string | null {
  return providerFor(video)?.label ?? null
}

/** The host a viewer is sent to, e.g. `vimeo.com`, for use in link text. */
export function providerSite(video: Video | null | undefined): string | null {
  return providerFor(video)?.site ?? null
}

/**
 * The CSS `aspect-ratio` for a video's frame, defaulting to 16:9 as the
 * catalogue does.
 *
 * It lives beside the URL table because both video components need it and both
 * derive it from the same catalogue enum. The live page has no such rule: its
 * `wp-embed-aspect-16-9` classes match no CSS at all, and its shape survives
 * only because a hard-coded 500x281 happens to be 16:9.
 */
export function aspectRatioCss(ratio: AspectRatio | undefined): string {
  if (ratio && Object.prototype.hasOwnProperty.call(ASPECT_RATIOS, ratio)) {
    return ASPECT_RATIOS[ratio]
  }
  return ASPECT_RATIOS['16:9']
}
