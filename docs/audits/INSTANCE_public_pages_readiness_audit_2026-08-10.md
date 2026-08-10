# INSTANCE Public Pages Readiness Audit

Date: 2026-08-10

## GitHub

- Repository: `seiya058904/INSTANCE`
- Visibility: Public
- Default branch: `main`
- Description: `A narrative game where you play as an AI and respond to human conversations through authored choices.`
- Homepage: `https://seiya058904.github.io/INSTANCE/`
- Topics: `ai`, `choice-based-game`, `github-pages`, `interactive-fiction`, `narrative-game`, `react`, `typescript`, `vite`

## GitHub Pages

- Workflow: `.github/workflows/deploy-pages.yml`
- Pages source: GitHub Actions / workflow build
- Successful workflow run: `31367195005`
- Deployment commit: `3c1e943`
- Live URL: `https://seiya058904.github.io/INSTANCE/`
- Pages API reports `build_type: workflow`, public site, and HTTPS enabled.

## Public readiness

### Fixed

- Root repository structure organized into narrative libraries, audits, development prompts, and assets.
- Exact duplicate prompt removed after hash/content comparison.
- Batch03 and Real Usage source filenames normalized; Runtime imports, census tests, generator paths, and documentation references updated.
- Vite uses `/INSTANCE/` only for production builds; local development keeps `/`.
- README now includes the public project explanation, live demo, features, stack, local commands, and active-development status.
- GitHub Pages workflow uses the approved official Actions and required Pages permissions.

### No issue

- No high-confidence API key, token, cookie, password, private key, connection string, or credential filename found in the current tree or Git history, including `c9773d7`.
- No tracked `dist/`, `node_modules/`, coverage, screenshots, browser artifacts, logs, or environment files.
- `qaConversation` and `qaLongInput` remain guarded by `import.meta.env.DEV`.
- `npm audit`: 0 vulnerabilities.
- Static Pages requests for HTML, JavaScript, and CSS returned HTTP 200.
- Existing Vite large-bundle warning remains; no broad code-splitting change was made.

### Deferred

- Direct online traversal of LongformPreview, LongInputPreview, and multimodal/generated-image abstraction was not completed because production has no deterministic public QA route for selecting those assets. Existing related unit tests, source imports, and production build passed; this is not evidence of complete online feature verification.
- GitHub Actions emitted the existing Node 20 deprecation warning for some third-party action internals; deployment succeeded.

## Verification

- Tests: 24 test files / 133 tests passed.
- Build: passed with the known large-chunk warning.
- Desktop online smoke: title/HTML loaded, one authored Choice completed, reload preserved the selected conversation history.
- Mobile online smoke: 390×844 viewport, `scrollWidth == clientWidth == 390`, no horizontal overflow.
- Browser console: 0 errors and 0 warnings.
- Pages static requests: HTML, JS, and CSS all HTTP 200.

## Git

- Hygiene commit: `710083f chore: organize repository structure`
- Publish commit: `3c1e943 chore: publish INSTANCE website`
- `main == origin/main`: yes
- Ahead/behind: `0/0`
- Working tree: clean at audit time

## Remaining issues

- P0: none
- P1: none
- P2: add a deterministic non-production or test-only route for targeted online Longform / LongInput / multimodal smoke coverage if that coverage becomes a release requirement. Do not expose it as a production feature by default.
