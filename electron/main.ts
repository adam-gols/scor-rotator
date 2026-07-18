import { app, BrowserWindow, ipcMain, shell } from 'electron'
import path from 'node:path'
import dotenv from 'dotenv'

/** Public streams proxy URL (not a secret). Rewritten by scripts/write-streams-api-url.mjs in CI. */
const BAKED_STREAMS_API_URL = 'https://scor-rotator-streams.gols.workers.dev'

const isDev = !app.isPackaged

if (isDev) {
  dotenv.config({ path: path.join(process.cwd(), '.env') })
}

let mainWindow: BrowserWindow | null = null
let playbackWindow: BrowserWindow | null = null
let desiredPlaybackTitle: string | null = null
let airtableTokenOverride: string | null = null

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    backgroundColor: '#0f1c41',
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  })

  if (isDev) {
    const devUrl = process.env.VITE_DEV_SERVER_URL || 'http://localhost:5173'
    void mainWindow.loadURL(devUrl)
  } else {
    void mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
  }

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

function closePlaybackWindow() {
  if (!playbackWindow) return

  try {
    void playbackWindow.webContents.executeJavaScript(
      "try{document.querySelectorAll('video,audio').forEach(m=>{m.pause(); m.src='';});}catch(e){}",
      true,
    )
  } catch {
    // ignore
  }

  try {
    playbackWindow.destroy()
  } catch {
    try {
      playbackWindow.close()
    } catch {
      // ignore
    }
  }

  playbackWindow = null
}

function openPlaybackWindow(url: string) {
  closePlaybackWindow()

  playbackWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    backgroundColor: '#000000',
    title: desiredPlaybackTitle ?? 'SCOR Playback',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  })

  playbackWindow.webContents.on('did-finish-load', () => {
    if (!playbackWindow || playbackWindow.isDestroyed()) return
    if (desiredPlaybackTitle) playbackWindow.setTitle(desiredPlaybackTitle)
  })

  playbackWindow.on('closed', () => {
    playbackWindow = null
    mainWindow?.webContents.send('playback:closed')
  })

  playbackWindow.webContents.setAudioMuted(false)
  playbackWindow.webContents.setWindowOpenHandler(({ url: openUrl }) => {
    void shell.openExternal(openUrl)
    return { action: 'deny' }
  })

  void playbackWindow.loadURL(url)
  playbackWindow.show()
  playbackWindow.focus()
}

type AirtableRecord = {
  id: string
  fields: Record<string, unknown>
}

function airtableConfig() {
  return {
    baseId: process.env.AIRTABLE_BASE_ID || 'appbP3QMzpB7ZaW7W',
    tableId: process.env.AIRTABLE_TABLE_ID || 'tblgMy87FGUjJdd11',
    viewId: process.env.AIRTABLE_VIEW_ID || 'viwWeCzdCv6GmEdcj',
  }
}

/** Public proxy URL — packaged builds use the baked default; dev may override via env. */
function streamsApiBase(): string {
  const fromEnv = (process.env.SCOR_STREAMS_API_URL || '').trim().replace(/\/$/, '')
  if (fromEnv) return fromEnv
  return BAKED_STREAMS_API_URL.replace(/\/$/, '')
}

async function fetchTodayFromProxy(): Promise<Array<{ name: string; url: string }>> {
  const base = streamsApiBase()
  if (!base) {
    throw new Error(
      'Streams API URL is not configured. Set SCOR_STREAMS_API_URL or deploy workers/streams-api.',
    )
  }

  const res = await fetch(`${base}/today`)
  const text = await res.text().catch(() => '')
  let data: { ok?: boolean; items?: Array<{ name: string; url: string }>; error?: string }
  try {
    data = JSON.parse(text) as typeof data
  } catch {
    throw new Error(`Streams API returned non-JSON (${res.status}): ${text.slice(0, 200)}`)
  }

  if (!res.ok || !data.ok) {
    throw new Error(`Streams API failed (${res.status}): ${data.error || text || res.statusText}`)
  }

  const items = Array.isArray(data.items) ? data.items : []
  console.log(`[streams-api] fetched usableStreams=${items.length} from ${base}`)
  return items.map((x) => ({
    name: typeof x.name === 'string' ? x.name : '',
    url: typeof x.url === 'string' ? x.url : '',
  }))
}

async function airtableFetchAllFromView(
  tokenOverride?: string,
): Promise<Array<{ name: string; url: string }>> {
  // Re-read mounted .env in case 1Password auth completed after process start.
  if (isDev) {
    dotenv.config({ path: path.join(process.cwd(), '.env'), override: false })
  }

  const token = (tokenOverride || airtableTokenOverride || process.env.AIRTABLE_TOKEN || '').trim()
  if (!token)
    throw new Error('Missing Airtable token. Set AIRTABLE_TOKEN in 1Password .env or Settings.')

  const { baseId, tableId, viewId } = airtableConfig()
  const out: Array<{ name: string; url: string }> = []
  let offset: string | undefined
  let totalRecords = 0

  const toStringVal = (v: unknown): string => {
    if (typeof v === 'string') return v
    if (typeof v === 'number') return String(v)
    return ''
  }

  const extractUrl = (v: unknown): string => {
    if (typeof v === 'string') return v
    if (Array.isArray(v)) {
      const first = v[0] as { url?: string } | string | undefined
      if (typeof first === 'string') return first
      if (first && typeof first === 'object' && typeof first.url === 'string') return first.url
      return ''
    }
    if (v && typeof v === 'object' && typeof (v as { url?: string }).url === 'string') {
      return (v as { url: string }).url
    }
    return ''
  }

  for (let i = 0; i < 50; i++) {
    const url = new URL(`https://api.airtable.com/v0/${baseId}/${tableId}`)
    url.searchParams.set('view', viewId)
    url.searchParams.set('pageSize', '100')
    if (offset) url.searchParams.set('offset', offset)

    const res = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${token}` },
    })

    if (!res.ok) {
      const text = await res.text().catch(() => '')
      const hint =
        res.status === 401
          ? ' Check Settings for a stale token override, or clear it to use AIRTABLE_TOKEN from .env.'
          : ''
      throw new Error(`Airtable request failed (${res.status}): ${text || res.statusText}.${hint}`)
    }

    const data = (await res.json()) as { records: AirtableRecord[]; offset?: string }
    totalRecords += data.records?.length ?? 0

    for (const r of data.records ?? []) {
      const name = toStringVal(r.fields['Channel Title']).trim()
      const streamUrl = extractUrl(r.fields['Stream Link']).trim()
      if (name && streamUrl) out.push({ name, url: streamUrl })
    }

    if (!data.offset) break
    offset = data.offset
  }

  console.log(`[airtable] fetched records=${totalRecords} usableStreams=${out.length}`)
  return out
}

/**
 * Packaged builds use the public streams proxy (no user keys).
 * Dev: proxy if SCOR_STREAMS_API_URL is set; else direct Airtable via .env / Settings.
 * Explicit token override always uses direct Airtable (developer path).
 */
async function loadTodayStreams(
  tokenOverride?: string,
): Promise<Array<{ name: string; url: string }>> {
  const explicitToken = (tokenOverride || airtableTokenOverride || '').trim()
  if (explicitToken) {
    return airtableFetchAllFromView(tokenOverride)
  }

  if (!isDev) {
    return fetchTodayFromProxy()
  }

  if ((process.env.SCOR_STREAMS_API_URL || '').trim()) {
    return fetchTodayFromProxy()
  }

  return airtableFetchAllFromView(tokenOverride)
}

app.whenReady().then(() => {
  createMainWindow()

  ipcMain.handle('airtable:setToken', (_evt, token: string) => {
    airtableTokenOverride = (token || '').trim() || null
    return { ok: true as const }
  })

  ipcMain.handle('airtable:loadTodayView', async (_evt, token?: string) => {
    const items = await loadTodayStreams(typeof token === 'string' ? token : undefined)
    return { ok: true as const, items }
  })

  ipcMain.handle('playback:open', (_evt, url: string) => {
    openPlaybackWindow(url)
    return { ok: true as const }
  })

  ipcMain.handle('playback:close', () => {
    closePlaybackWindow()
    return { ok: true as const }
  })

  ipcMain.handle('playback:navigate', (_evt, url: string) => {
    if (!playbackWindow || playbackWindow.isDestroyed()) {
      openPlaybackWindow(url)
      return { ok: true as const, reopened: true as const }
    }

    void playbackWindow.loadURL(url)

    if (desiredPlaybackTitle) {
      const once = () => {
        try {
          playbackWindow?.setTitle(desiredPlaybackTitle!)
        } finally {
          try {
            playbackWindow?.webContents.removeListener('did-finish-load', once)
          } catch {
            // ignore
          }
        }
      }
      playbackWindow.webContents.on('did-finish-load', once)
    }

    playbackWindow.focus()
    return { ok: true as const, reopened: false as const }
  })

  ipcMain.handle('playback:setTitle', (_evt, title: string) => {
    desiredPlaybackTitle = title
    if (playbackWindow && !playbackWindow.isDestroyed()) {
      try {
        playbackWindow.setTitle(title)
      } catch {
        // ignore
      }
    }
    return { ok: true as const }
  })

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
