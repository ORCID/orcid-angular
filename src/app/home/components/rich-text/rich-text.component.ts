import { Component, Input } from '@angular/core'

import { Paragraph, parseMarkdownLite } from './markdown-lite'

/** ORCID's own domain; everything else opens in a new tab. */
const ORCID_HOST = 'orcid.org'

/**
 * A parsed node with every rendering decision already made, so the template
 * binds values instead of calling predicates. Angular's template checker does
 * not narrow a discriminated union through `@if`/`@switch` on a discriminant,
 * and resolving `external` once per node also keeps `new URL()` out of change
 * detection.
 */
export interface RenderedNode {
  type: 'text' | 'bold' | 'link'
  text: string
  href: string
  external: boolean
}

/** A `mailto:` opens a mail client, not a tab, so it is never "external". */
function isMailto(href: string): boolean {
  return href.toLowerCase().startsWith('mailto:')
}

/**
 * Whether a link leaves ORCID and therefore opens in a new tab.
 *
 * `mailto:` is deliberately internal. `new URL('mailto:support@orcid.org').host`
 * is `''`, which is neither `orcid.org` nor `*.orcid.org`, so the previous host
 * comparison alone opened a blank tab for a perfectly reachable address.
 */
export function isExternalHref(href: string): boolean {
  if (isMailto(href)) {
    return false
  }
  try {
    const host = new URL(href).host.toLowerCase()
    return host !== ORCID_HOST && !host.endsWith(`.${ORCID_HOST}`)
  } catch {
    return false
  }
}

/**
 * Renders a markdown-lite string from the content bundle.
 *
 * The template builds elements from parsed nodes, so no CMS text is ever
 * interpolated as HTML. That is why there is no `[innerHTML]` here and no call
 * to `bypassSecurityTrustHtml`, unlike the WordPress path this replaces.
 */
@Component({
  selector: 'app-rich-text',
  standalone: true,
  templateUrl: './rich-text.component.html',
  styleUrls: ['./rich-text.component.scss'],
})
export class RichTextComponent {
  paragraphs: RenderedNode[][] = []

  @Input() set markdown(value: string) {
    this.paragraphs = parseMarkdownLite(value).map(toRenderedNodes)
  }

  /**
   * Set when this string fell back to English inside a non-English page, from
   * `meta.untranslated`. Without it a screen reader reads English through, say,
   * an Arabic voice — SC 3.1.2, and the reason both this component and
   * `app-heading` take the pair.
   */
  @Input() lang?: string
  @Input() dir?: 'ltr' | 'rtl'

  /**
   * `auto` is the backstop for any string the build could not classify: the
   * browser picks the direction from the first strong character.
   */
  get textDir(): string {
    return this.dir ?? 'auto'
  }

  /** Part of the anchor's accessible name, so it is never an icon alone. */
  readonly opensInNewTab = $localize`:@@home.opens_in_new_tab:(opens in a new tab)`
}

function toRenderedNodes(paragraph: Paragraph): RenderedNode[] {
  return paragraph.map((node) => ({
    type: node.type,
    text: node.text,
    href: node.type === 'link' ? node.href : '',
    external: node.type === 'link' && isExternalHref(node.href),
  }))
}
