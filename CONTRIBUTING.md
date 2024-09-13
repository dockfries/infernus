# Contributing Guide

Thanks for lending a hand 👋

## Development

### Setup

- We use [pnpm](https://pnpm.js.org/) to manage dependencies.
- Install dependencies with `pnpm i -w`.
- Build packages with `pnpm build -w`.
- If you are starting a build for the first time, please build `streamer` once, then `core`.

### Coding conventions

- We use ESLint to lint and Prettier to format the codebase. Before you commit, all files will be formatted automatically.
- We use [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/). Please use a prefix. If your PR has multiple commits and some of them don't follow the Conventional Commits rule, we'll do a squash merge.