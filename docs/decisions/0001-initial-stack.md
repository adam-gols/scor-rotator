# Decision: Initial stack

## Context

Remake of SCOR Stream Rotator (`adam-gols/scor` / local `SCORStreamRotator`) under the GOLS project template: 1Password secrets, brand kit, scripts, and PR workflow.

## Decision

- **TypeScript** + **Vite** + **React 18** renderer
- **Electron** for Windows/Mac desktop shell and playback window
- **Airtable REST** from main process (no local database)
- **pnpm**, **Vitest**, **ESLint**, **Prettier**
- Secrets via **1Password Environment** `scor-rotator Development` mounted to `.env`

## Reasoning

Matches the proven previous app while aligning with template standards (env mounts, brand assets, `./scripts/*`, smoke tests). Electron avoids iframe restrictions and gives a dedicated playback window.

## Consequences

- GUI packaging needs electron-builder per platform
- Headless CI can run Vitest without launching Electron
- Airtable view/field names are coupled to the existing base schema
