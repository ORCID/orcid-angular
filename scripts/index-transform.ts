import { uniqueIndexLength } from './unique.index.length.post-build'

export function indexTransform(indexHtml, target): string {
  indexHtml = uniqueIndexLength(indexHtml, target)
  return indexHtml
}
