# Contributing

External contributions are welcome. This page describes what continuous
integration will do to your pull request, so nothing about it is a surprise.

## Opening a pull request

Branch naming, for people with write access to this repository, is
`<your-name>/<TICKET-ID>`, for example `lmendoa/PD-1234`. A pre-commit hook
enforces it. Contributors working from a fork can name their branch anything.

Four checks must pass before a pull request can merge:

| Check                   | What it does                                                                                                                                                                                            |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `lint / pre-commit`     | Runs [pre-commit](https://pre-commit.com/): YAML validity, no oversized files, shebangs on executables, and **actionlint** over `.github/workflows/`. This is the only thing that lints workflow files. |
| `format / format`       | Runs Prettier. See below, it behaves differently depending on where your branch lives.                                                                                                                  |
| `test_yarn / test_yarn` | Unit tests for the app and the five sibling projects under `projects/`, plus the postbuild characterization tests.                                                                                      |
| `bld_yarn / bld_yarn`   | A full production build of all 21 locales, then checks that the emitted layout is still routable by the deployed nginx and Tomcat rules.                                                                |

## Formatting

**If your branch is in this repository**, you do not need to run Prettier
yourself. The `format` job applies it and pushes the fix to your branch. That
push starts a new CI run on the formatted commit and cancels the superseded one,
so the commit that merges is the formatted one and nothing is tested twice.

**If you are working from a fork**, CI cannot push to your branch, so the same
job only checks. If it fails, run:

```bash
yarn format
```

and push the result. Prettier does not look at `.github/**`; workflow files are
covered by actionlint inside `lint / pre-commit`.

Both cases are the same command locally, so running `yarn format` before you
push is never wrong.

## Running things locally

```bash
nvm use                 # Node version comes from .nvmrc
yarn --frozen-lockfile

yarn build:i18n         # generates messages.xlf and the xx/lr/rl test locales
yarn start              # dev server against the QA backend

yarn test-headless:ci   # unit tests, uses your system Chrome
yarn test:scripts       # postbuild characterization tests
yarn format:check       # what the format job checks
```

Two notes that save time:

- `src/locale/messages.xlf` and the `xx`, `lr` and `rl` locale files are
  generated and deliberately not committed. Run `yarn build:i18n` once after a
  fresh clone. Real translations come from Transifex through the
  `pull-translations` workflow.
- The dev server only recognises port **4200**. On any other port the app falls
  back to its production environment and calls hosts that do not exist locally.

## Changing the build output

`scripts/postbuild.ts` shapes the directory tree that production actually
serves, and four systems outside this repository depend on that shape: the WAR,
a Tomcat rewrite valve, two nginx layers, and Cloudflare's URL-keyed cache. The
rules are written down, with their sources, in
`scripts/__tests__/helpers/routing-contract.ts`.

If you change anything under `scripts/`, run:

```bash
yarn test:scripts                        # characterization tests
yarn build && yarn build:manifest:check  # the committed layout snapshot
yarn build:verify                        # resolves the real build through the nginx rules
```

A layout change is not forbidden, but it has to be deliberate. `build:manifest:check`
fails on any new or missing path so the diff shows up in review; re-record it
with `yarn build:manifest` once you are sure.

## Reporting a security issue

Please do not open a public issue. Follow the process at
<https://info.orcid.org/security/>.
