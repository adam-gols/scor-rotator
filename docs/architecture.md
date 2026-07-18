# Architecture

## Overview

SCOR Rotator is an Electron desktop app. The React (Vite) renderer manages a playlist and timed rotation. The Electron main process owns the playback window and Airtable API calls (token from mounted `.env` or optional Settings override).

## Diagram

```txt
[React UI] --IPC--> [Electron main]
                        |-- playback BrowserWindow
                        |-- Airtable REST (today view)
[localStorage] <-- playlist / loop prefs
[1Password Environment] --mount--> .env (AIRTABLE_*)
```

## Components

| Component | Location | Responsibility |
|-----------|----------|----------------|
| Renderer UI | `src/App.tsx` | Playlist, start/stop, countdown, Settings |
| Playlist helpers | `src/lib/playlist.ts` | URL/duration validation, next index |
| Storage | `src/lib/storage.ts` | localStorage persistence |
| Electron main | `electron/main.ts` | Windows, Airtable fetch, IPC |
| Preload bridge | `electron/preload.ts` | `window.playback` / `window.airtable` |

## Key decisions

See [decisions/0001-initial-stack.md](./decisions/0001-initial-stack.md).
