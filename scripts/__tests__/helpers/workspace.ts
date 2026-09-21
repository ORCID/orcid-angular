/**
 * Disposable copy of a built `dist/` tree, plus a runner for the REAL
 * `scripts/postbuild.ts`.
 *
 * The harness characterizes production code as-is: nothing here reimplements
 * or stubs a postbuild step, so an assertion that passes proves the shipped
 * script produces the layout the deployed nginx/Tomcat/Cloudflare rules
 * expect.
 */

import { spawnSync } from 'child_process'
import * as fs from 'fs'
import * as os from 'os'
import * as path from 'path'

/** <repo>/scripts/__tests__/helpers/workspace.ts -> <repo> */
export const REPO_ROOT = path.resolve(__dirname, '..', '..', '..')

const FIXTURES_DIR = path.join(REPO_ROOT, 'scripts', '__fixtures__')
const PRINT_VIEW_FIXTURES = path.join(FIXTURES_DIR, 'print-view')

const TS_NODE_BIN = path.join(
  REPO_ROOT,
  'node_modules',
  'ts-node',
  'dist',
  'bin.js'
)
const SCRIPTS_TSCONFIG = path.join(REPO_ROOT, 'scripts', 'tsconfig.json')
const POSTBUILD_SCRIPT = path.join(REPO_ROOT, 'scripts', 'postbuild.ts')

/** Guards cleanupWorkspace against deleting anything we did not create. */
const WORKSPACE_PREFIX = 'orcid-postbuild-'

/**
 * Files that can appear inside a fixture directory without being part of the
 * simulated build output: OS metadata, editor backups, and documentation.
 * README.md is here because one already leaked into a golden manifest.
 */
const IGNORED_FIXTURE_FILES =
  /^(\.DS_Store|Thumbs\.db|\.gitkeep|README\.md|.*~|.*\.swp)$/

/**
 * Copies `scripts/__fixtures__/<fixtureName>/` into a throwaway `<ws>/dist/`
 * and stages the two `src/` inputs postbuild reads from cwd.
 *
 * The fixture lands at `<ws>/dist/<locale>/...` and nowhere else: utils.ts
 * derives the locale as `file.split('/')[2]` of each matched
 * `index.html` path, so an extra or missing directory level silently yields the
 * wrong locale suffix rather than an error.
 *
 * The workspace is deliberately NOT a git repo. git-repo-info walks up from
 * cwd and returns nulls (rather than throwing) when it finds no `.git`, so
 * build-info emits a stable `<!--null/null-->`. Only the other half of that
 * comment matters in production: monit fetches /reset-password with
 * `Cookie: locale_v3=fr` and requires the body to contain the literal `--fr`.
 */
export function createWorkspace(fixtureName: string): string {
  const fixtureDir = path.join(FIXTURES_DIR, fixtureName)
  if (!fs.existsSync(fixtureDir)) {
    throw new Error(
      `createWorkspace: fixture "${fixtureName}" not found at ${fixtureDir}`
    )
  }
  if (!fs.existsSync(PRINT_VIEW_FIXTURES)) {
    throw new Error(
      `createWorkspace: print-view fixtures not found at ${PRINT_VIEW_FIXTURES}`
    )
  }

  // realpath because macOS os.tmpdir() is a symlink (/var -> /private/var):
  // the spawned process reports the resolved cwd, so resolving here keeps the
  // path a test asserts on identical to the one postbuild wrote to.
  const ws = fs.realpathSync(
    fs.mkdtempSync(path.join(os.tmpdir(), WORKSPACE_PREFIX))
  )

  // Filtered, not a plain recursive copy: anything present in the fixture tree
  // reaches postbuild as if the build had emitted it, so a stray .DS_Store or
  // an editor backup on one developer's machine would show up as two extra
  // keys in the layout manifest and fail the golden on their machine only.
  fs.cpSync(fixtureDir, path.join(ws, 'dist'), {
    recursive: true,
    filter: (src) => !IGNORED_FIXTURE_FILES.test(path.basename(src)),
  })

  // print-view-localize.postbuild.ts reads both of these cwd-relative:
  // './src/assets/print-view/fetch-orcid.js' and './src/locale/messages.*.xlf'.
  // (new-relic.runtime.js is resolved from __dirname instead, so the real one
  // in the repo is used and must not be copied here.)
  const printViewSource = path.join(PRINT_VIEW_FIXTURES, 'fetch-orcid.js')
  if (!fs.existsSync(printViewSource)) {
    throw new Error(
      `createWorkspace: print-view source not found at ${printViewSource}`
    )
  }
  const printViewDest = path.join(
    ws,
    'src',
    'assets',
    'print-view',
    'fetch-orcid.js'
  )
  fs.mkdirSync(path.dirname(printViewDest), { recursive: true })
  fs.cpSync(printViewSource, printViewDest, { recursive: true })

  const localeDir = path.join(ws, 'src', 'locale')
  fs.mkdirSync(localeDir, { recursive: true })
  fs.readdirSync(PRINT_VIEW_FIXTURES)
    .filter((name) => name.startsWith('messages.') && name.endsWith('.xlf'))
    .forEach((name) => {
      fs.cpSync(
        path.join(PRINT_VIEW_FIXTURES, name),
        path.join(localeDir, name),
        { recursive: true }
      )
    })

  return ws
}

/**
 * Runs the real postbuild against a workspace and returns stdout + stderr.
 *
 * The three repo paths must be absolute: cwd is the workspace, and every glob
 * inside postbuild ('./dist/...') plus the print-view inputs ('./src/...')
 * resolve against that cwd. A repo-relative script path would make ts-node
 * look for postbuild.ts inside the workspace.
 */
export function runPostbuild(ws: string): string {
  const required: [string, string][] = [
    ['ts-node binary', TS_NODE_BIN],
    ['scripts tsconfig', SCRIPTS_TSCONFIG],
    ['postbuild script', POSTBUILD_SCRIPT],
  ]
  for (const [label, target] of required) {
    if (!fs.existsSync(target)) {
      throw new Error(
        `runPostbuild: ${label} not found at ${target} (run \`yarn install\`?)`
      )
    }
  }

  const result = spawnSync(
    process.execPath,
    [TS_NODE_BIN, '-P', SCRIPTS_TSCONFIG, POSTBUILD_SCRIPT],
    {
      cwd: ws,
      encoding: 'utf8',
      maxBuffer: 32 * 1024 * 1024,
    }
  )

  const output = (result.stdout || '') + (result.stderr || '')

  if (result.error) {
    throw new Error(
      `runPostbuild: could not spawn ts-node: ${result.error.message}\n${output}`
    )
  }

  // Fold the whole transcript into the message: a CI failure here has no other
  // artifact to inspect.
  if (result.status !== 0) {
    const signal = result.signal ? ` (signal ${result.signal})` : ''
    throw new Error(
      [
        `runPostbuild: postbuild exited with status ${result.status}${signal}`,
        `cwd: ${ws}`,
        output,
      ].join('\n')
    )
  }

  return output
}

export function cleanupWorkspace(ws: string): void {
  if (!path.basename(ws).startsWith(WORKSPACE_PREFIX)) {
    throw new Error(
      `cleanupWorkspace: refusing to delete ${ws}, which was not created by createWorkspace`
    )
  }
  fs.rmSync(ws, { recursive: true, force: true })
}

/** Recursive file list, relative to `dir`, forward slashes, sorted. */
export function listFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) {
    return []
  }
  const found: string[] = []
  const walk = (current: string, prefix: string): void => {
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      // Always '/': the nginx asset route regex and the golden manifests are
      // written in URL terms, not in whatever path.sep this host uses.
      const relative = prefix ? `${prefix}/${entry.name}` : entry.name
      if (entry.isDirectory()) {
        walk(path.join(current, entry.name), relative)
      } else {
        found.push(relative)
      }
    }
  }
  walk(dir, '')
  return found.sort()
}

export function readText(file: string): string {
  return fs.readFileSync(file, 'utf8')
}

export function exists(p: string): boolean {
  return fs.existsSync(p)
}

/** Immediate subdirectory names, sorted. */
export function listDirs(dir: string): string[] {
  if (!fs.existsSync(dir)) {
    return []
  }
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort()
}
