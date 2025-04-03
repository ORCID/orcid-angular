export function addOneTrustNotAutoBlockForAppScripts(data) {
  // This regex does the following:
  // - `<script\b` matches the literal "<script" followed by a word boundary.
  // - `(?![^>]*\bdata-ot-ignore\b)` is a negative lookahead ensuring that the attribute isn't already present.
  // - `([^>]*)` captures any other attributes inside the tag (until the closing '>').
  //
  // The replacement inserts "data-ot-ignore" into the tag.
  return data.replace(
    /<script\b(?![^>]*\bdata-ot-ignore\b)([^>]*)>/gi,
    '<script data-ot-ignore$1>'
  )
}
