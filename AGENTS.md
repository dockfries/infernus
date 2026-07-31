# Infernus — Agent Guide

Monorepo for the `@infernus/*` npm packages — Node.js library for scripting [Open Multiplayer](https://open.mp).

## Quick start

```bash
pnpm install              # no --frozen-lockfile needed
pnpm lint                 # oxlint (not eslint)
pnpm format               # oxfmt
tsx scripts/build.ts      # interactive single-package build
tsx scripts/build-all.ts  # build all packages in order
tsx scripts/type-check.ts # all-package type check
pnpm docs:dev             # VitePress dev server
```

## Build

- **Bundler**: [rolldown](https://rolldown.rs) (not rollup).
- Each package entry is `src/main.ts` → outputs `dist/bundle.mjs` (ESM), `dist/bundle.js` (CJS), `dist/bundle.d.ts` (types).
- Building **includes type-checking** first (custom `tsx scripts/type-check.ts` — not `tsc`).
- Build order: `streamer` → `core` → `raknet` → rest (enforced by `build-all.ts`).
- `@infernus/types` and `@infernus/shared` have no `src/main.ts` and are excluded from build.
- Set `TARGET=<name>` env to build a specific package non-interactively.
- `@infernus/streamer` is `"private": true` (not published).
- Most packages list `@infernus/core` as a **peerDependency**.

## Quality

- **lint**: `pnpm lint` (oxlint, with `oxlint-tsgolint` plugin). No eslint.
- **format**: `pnpm format` (oxfmt).
- **type-check**: `tsx scripts/type-check.ts [packageName]`.
- **No tests** — no test framework is configured.
- Pre-commit hook runs `lint-staged` (lint on `*.{ts,js}`, format on `*.{ts,js,json,yml}`).

## Commits

- [Conventional Commits](https://www.conventionalcommits.org/) enforced by `@commitlint/config-conventional`.
- **Scope is required**: `scope-empty: [2, "never"]`.

## Release

`tsx scripts/release.ts` → interactive select → build → bump → dry-run publish. Core release also syncs version to root `package.json`.

## TypeScript

- TypeScript 6.0, `"module": "ESNext"`, `"moduleResolution": "bundler"`, `"strict": true`.
- Uses `experimentalDecorators` and `emitDecoratorMetadata`.
- Path aliases: `core/*`, `raknet/*`, `filterscript/*`, `shared/*`.
- No per-package `tsconfig.json` — single root config.

## Docs

- VitePress under `docs/`. Dev: `pnpm docs:dev`. Deployed to GitHub Pages on main branch changes to `docs/` or `package.json`.

### JSDoc conventions

No full JSDoc style is used — TypeScript types are the contract. Only two tags are allowed:

- `@throws` — the one thing types can't express. Follow the [JSDoc spec](https://jsdoc.app/tags-throws): `@throws {<ExceptionType>} description`, with the exception type in curly braces. Add it to public methods/functions that can throw, as close to the throwing code as possible (method/function level, not class level):
  - **Method level**: one `@throws` per throwing method, describing the condition (e.g. lifecycle guard "when called before `create()`", range validation, native failure).
  - **Class level**: avoid — a class-level tag should only be used when virtually every method throws for a common reason and method-level tags would be pure noise.
- `@deprecated` — marks deprecated APIs; preserved into `dist/bundle.d.ts`.

Skip `@throws` on private static-class constructors, internal utils (`bus.ts`, `hook.ts`), and throws unreachable by consumers. If the exception class is not exported from the package's `src/main.ts`, describe it in plain text instead of `@link`.

## Structure

- 23 packages under `packages/*`, all `@infernus/*` scope.
- `core/` is the main library (`@infernus/core`).
- `create-app/` is a CLI scaffolding tool (`@infernus/create-app`, published as `npx infernus`).
- `.gitignore` blocks `.vscode`, `.npmrc`, `node_modules`, `dist`.
