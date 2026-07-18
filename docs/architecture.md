# Architecture

## Overview

SCOR Rotator is an Electron desktop app. The React (Vite) renderer manages a playlist and timed rotation. The Electron main process owns the playback window and loads today’s stream list.

**Packaged installs** call a public **streams proxy** (Cloudflare Worker). The Airtable token never ships in the app. **Local dev** can use the proxy (`SCOR_STREAMS_API_URL`) or call Airtable directly with `AIRTABLE_TOKEN` from a 1Password-mounted `.env` / optional Settings override.

## Diagram

```txt
Packaged (SCOR / GOLS operators)
[React UI] --IPC--> [Electron main]
                        |-- playback BrowserWindow
                        |-- GET {STREAMS_API_URL}/today
[Streams proxy Worker] --Bearer--> [Airtable today view]
[localStorage] <-- playlist / loop prefs

Dev (contributors)
[1Password Environment] --mount--> .env (AIRTABLE_* optional)
[Electron main] -- either --> streams proxy  OR  Airtable REST
```

## Components

| Component | Location | Responsibility |
|-----------|----------|----------------|
| Renderer UI | `src/App.tsx` | Playlist, start/stop, countdown, Settings |
| Playlist helpers | `src/lib/playlist.ts` | URL/duration validation, next index |
| Storage | `src/lib/storage.ts` | localStorage persistence |
| Electron main | `electron/main.ts` | Windows, Load Today (proxy or Airtable), IPC |
| Streams API URL | `electron/streamsApiUrl.ts` | Baked public proxy base URL |
| Preload bridge | `electron/preload.ts` | `window.playback` / `window.airtable` |
| Streams proxy | `workers/streams-api/` | Holds `AIRTABLE_TOKEN`; `GET /today` |

## Key decisions

See [decisions/0001-initial-stack.md](./decisions/0001-initial-stack.md) and [decisions/0002-streams-proxy-releases.md](./decisions/0002-streams-proxy-releases.md).
