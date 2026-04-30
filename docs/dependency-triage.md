# Dependency security triage (2026-04-30)

Branch: `chore/dependabot-triage`

## Summary

| Metric | Before (approx.) | After this branch |
|--------|-------------------|-------------------|
| `npm audit` total | ~64 | **25** |
| Critical | 4 | **0** |
| High | ~27 | **11** |
| Moderate | ~19 | **5** |
| Low | ~14 | **9** |

Most remaining findings are **transitive dependencies of `react-scripts@5.0.1`** (Create React App). They affect the **local dev server / build toolchain** (e.g. `webpack-dev-server`, `webpack`, `workbox-*`, `jest` / `jsdom`). The **static production build** served from GitHub Pages does not run `webpack-dev-server` or expose those code paths to end users.

## Actions taken on this branch

1. **`npm audit fix`** (two passes) — applied all fixes npm considered **non-breaking**. This pulled in newer patched versions of many transitive packages (Babel, lodash, semver, braces, etc.).
2. **`gh-pages` ^4 → ^6.3.0** (devDependency) — addresses **GHSA-8mmm-9v2q-x3f9** (prototype pollution in older `gh-pages`). Deploy CLI API unchanged (`gh-pages -d build`).
3. **Removed `all` ^0.0.0** — stray / useless dependency; reduces noise and install surface.

## What is still open (and why)

The **25 remaining** issues cluster under:

- **`react-scripts` → `webpack-dev-server` → `sockjs` / `uuid`** — dev-only; no fix without upgrading or replacing CRA.
- **`react-scripts` → `workbox-webpack-plugin` / `css-minimizer-webpack-plugin` / `serialize-javascript` / `rollup-plugin-terser`** — build-time bundling; `npm audit fix --force` wants to replace `react-scripts` with an invalid placeholder — **do not use `--force`** here.
- **`nth-check` / old `postcss` via `resolve-url-loader`** — same CRA tree; force-fix incorrectly targets `react-scripts@0.0.0`.

**Practical risk for this repo:** Low for **production** (static HTML/JS/CSS on `gh-pages`). Higher for **developers** running `npm start` on untrusted networks (dev server); keep dev machine and browser updated.

## Recommended next steps (outside this minimal triage)

1. **Migrate off Create React App** to **Vite** + `@vitejs/plugin-react` (or Next.js if you need SSR). This removes the frozen `react-scripts` dependency cone and is the only durable way to clear the bulk of advisories.
2. **Upgrade TensorFlow.js / handpose** when feasible — `@tensorflow/tfjs@3.x` pulls its own dependency tree; newer majors may reduce noise (test AR mode thoroughly after any bump).
3. **Optional:** `npm audit --production` (or `npm audit --omit=dev`) for a **deploy-relevant** view — expect far fewer issues for a static site.

## Verification

- `npm run build` — success on this branch.
- `npm test -- --watchAll=false` — success (existing smoke test).
