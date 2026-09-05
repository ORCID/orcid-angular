/**
 * The tiny markdown subset the homepage content uses.
 *
 * Content comes from a CMS, so it must never be handed to `innerHTML`. Instead
 * of sanitising a string, this parses it into nodes that a template renders as
 * real elements: there is no HTML sink anywhere in the path, and a link's href
 * is checked here rather than trusted.
 *
 * Supported: paragraphs separated by a blank line, `**bold**`, and
 * `[text](https://…)`. Anything else is left as literal text, which is also
 * what the publisher's own linter rejects before content is ever released.
 */

export interface TextNode {
  type: 'text'
  text: string
}

export interface BoldNode {
  type: 'bold'
  text: string
}

export interface LinkNode {
  type: 'link'
  text: string
  href: string
}

export type InlineNode = TextNode | BoldNode | LinkNode

/** A paragraph is a run of inline nodes; a document is a list of paragraphs. */
export type Paragraph = InlineNode[]

const INLINE = /\*\*([^*]+)\*\*|\[([^\]]+)\]\(([^)\s]+)\)/g

/**
 * Only these can appear in an href. `javascript:` and `data:` are the reason
 * this list is an allowlist rather than a check for what to strip.
 */
function safeHref(href: string): string | null {
  if (href.startsWith('https://') || href.startsWith('mailto:')) {
    return href
  }
  return null
}

function pushText(nodes: InlineNode[], text: string): void {
  if (text.length > 0) {
    nodes.push({ type: 'text', text })
  }
}

function parseInline(source: string): InlineNode[] {
  const nodes: InlineNode[] = []
  let lastIndex = 0

  // A fresh regex per call: the global flag carries state between calls.
  const pattern = new RegExp(INLINE.source, 'g')
  let match = pattern.exec(source)

  while (match !== null) {
    pushText(nodes, source.slice(lastIndex, match.index))

    const [whole, bold, linkText, linkHref] = match
    if (bold !== undefined) {
      nodes.push({ type: 'bold', text: bold })
    } else {
      const href = safeHref(linkHref)
      if (href) {
        nodes.push({ type: 'link', text: linkText, href })
      } else {
        // An unusable link stays visible as the text the editor wrote, rather
        // than silently disappearing from the page.
        pushText(nodes, whole)
      }
    }

    lastIndex = match.index + whole.length
    match = pattern.exec(source)
  }

  pushText(nodes, source.slice(lastIndex))
  return nodes
}

export function parseMarkdownLite(markdown: string): Paragraph[] {
  if (typeof markdown !== 'string' || markdown.trim() === '') {
    return []
  }

  return markdown
    .replace(/\r\n/g, '\n')
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter((block) => block !== '')
    .map((block) => parseInline(block.replace(/\n/g, ' ')))
}
