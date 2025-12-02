import * as fs from 'fs'
import browserslist from 'browserslist'

// Using browserslist, generate a minimal set of supported browser minimum
// versions that can be consumed at runtime in the browser.
//
// The output is a JSON file with the shape:
// {
//   "chrome": { "major": 109, "minor": 0 },
//   "firefox": { "major": 115, "minor": 0 },
//   "safari": { "major": 16, "minor": 4 }
// }
//
// Keys are *canonical* family identifiers that we also map to at runtime when
// parsing the user agent string.

type SupportedBrowserVersion = {
  major: number
  minor: number
}

type SupportedBrowsers = Record<string, SupportedBrowserVersion>

// Map browserslist family identifiers to our canonical keys
const FAMILY_MAP: Record<string, string> = {
  chrome: 'chrome',
  and_chr: 'chrome',
  firefox: 'firefox',
  and_ff: 'firefox',
  safari: 'safari',
  ios_saf: 'safari',
  edge: 'edge',
  ios_safari: 'safari',
  opera: 'opera',
  op_mini: 'opera',
  samsung: 'samsung',
  ie: 'ie',
  ie_mob: 'ie',
}

function parseBrowserslistEntry(entry: string) {
  // Examples of entries:
  // - "chrome 127"
  // - "ios_saf 16.5-16.6"
  // - "firefox 115"
  const [rawFamily, rawVersionRange] = entry.split(' ')
  if (!rawFamily || !rawVersionRange) {
    return null
  }

  const family = FAMILY_MAP[rawFamily] ?? rawFamily

  // For ranges like "16.5-16.6" we take the minimum ("16.5")
  const versionStart = rawVersionRange.split('-')[0]
  const [majorPart, minorPart = '0'] = versionStart.split('.')
  const major = parseInt(majorPart, 10)
  const minor = parseInt(minorPart, 10)

  if (Number.isNaN(major)) {
    return null
  }

  return { family, major, minor: Number.isNaN(minor) ? 0 : minor }
}

function generateSupportedBrowsers(): SupportedBrowsers {
  // This will automatically pick up .browserslistrc at the project root
  const entries = browserslist(undefined, { path: process.cwd() })

  const minVersions: SupportedBrowsers = {}

  for (const entry of entries) {
    const parsed = parseBrowserslistEntry(entry)
    if (!parsed) continue

    const { family, major, minor } = parsed
    const current = minVersions[family]

    if (
      current === undefined ||
      major < current.major ||
      (major === current.major && minor < current.minor)
    ) {
      minVersions[family] = { major, minor }
    }
  }

  return minVersions
}

function writeSupportedBrowsersJson(supported: SupportedBrowsers) {
  const outputPath = './src/app/cdk/platform-info/supported-browsers.json'
  const json = JSON.stringify(supported, null, 2)

  fs.writeFileSync(outputPath, `${json}\n`, 'utf8')
  console.debug('Supported browsers JSON created at', outputPath)
}

function writeSupportedBrowsersMarkdown(supported: SupportedBrowsers) {
  const outputPath = './SUPPORTED_BROWSERS.md'

  const DISPLAY_NAME: Record<string, string> = {
    chrome: 'Google Chrome',
    firefox: 'Mozilla Firefox',
    safari: 'Apple Safari',
    edge: 'Microsoft Edge',
    opera: 'Opera',
    op_mob: 'Opera Mobile',
    android: 'Android WebView',
    samsung: 'Samsung Internet',
    ie: 'Internet Explorer',
  }

  const entries = Object.entries(supported).sort(([aKey], [bKey]) => {
    const aName = DISPLAY_NAME[aKey] ?? aKey
    const bName = DISPLAY_NAME[bKey] ?? bKey
    return aName.localeCompare(bName)
  })

  const lines: string[] = []

  lines.push('# Supported browsers')
  lines.push('')
  lines.push(
    '> This file is auto-generated from `.browserslistrc` during the prebuild step. Do not edit manually.'
  )
  lines.push('')
  lines.push('| Browser | Minimum version |')
  lines.push('|---------|-----------------|')

  for (const [key, version] of entries) {
    const name = DISPLAY_NAME[key] ?? key
    const major = version.major
    const minor = version.minor ?? 0
    const versionLabel =
      minor > 0 ? `${major}.${minor} or newer` : `${major} or newer`

    lines.push(`| ${name} | ${versionLabel} |`)
  }

  lines.push('')

  fs.writeFileSync(outputPath, lines.join('\n'), 'utf8')
  console.debug('Supported browsers markdown created at', outputPath)
}

try {
  const supported = generateSupportedBrowsers()
  writeSupportedBrowsersJson(supported)
  writeSupportedBrowsersMarkdown(supported)
} catch (err) {
  console.error('Error generating supported browsers JSON:', err)
  process.exit(1)
}
