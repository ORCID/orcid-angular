import { Component, Input } from '@angular/core'

import {
  InlineNode,
  LinkNode,
  Paragraph,
  parseMarkdownLite,
} from './markdown-lite'

/**
 * Renders a markdown-lite string from the content bundle.
 *
 * The template builds elements from parsed nodes, so no CMS text is ever
 * interpolated as HTML. That is why there is no `[innerHTML]` here and no call
 * to `bypassSecurityTrustHtml`, unlike the WordPress path this replaces.
 */
@Component({
  selector: 'app-rich-text',
  templateUrl: './rich-text.component.html',
  styleUrls: ['./rich-text.component.scss'],
  standalone: false,
})
export class RichTextComponent {
  paragraphs: Paragraph[] = []

  @Input() set markdown(value: string) {
    this.paragraphs = parseMarkdownLite(value)
  }

  /**
   * Narrows a node to a link for the template. Angular's template checker does
   * not narrow a union through `ngIf`/`ngSwitch` on a discriminant, so the
   * narrowing has to come back as a value it can bind with `as`.
   */
  asLink(node: InlineNode): LinkNode | null {
    return node.type === 'link' ? node : null
  }

  /** Links off orcid.org open in a new tab, as they do on the current page. */
  isExternal(node: LinkNode): boolean {
    try {
      const host = new URL(node.href).host
      return host !== 'orcid.org' && !host.endsWith('.orcid.org')
    } catch {
      return false
    }
  }
}
