import { useEffect, useMemo, useRef, useState } from 'react'
import { Logo } from './components/Logo'
import { clampInt, isValidHttpUrl, nextRotationIndex, playlistIsReady } from './lib/playlist'
import { navigatePopup, openOrReusePopup, writePopupHelperPage } from './lib/popup'
import { loadAirtableToken, saveAirtableToken } from './lib/settings'
import { loadLoop, loadPlaylist, saveLoop, savePlaylist } from './lib/storage'
import type { PlaylistItem, RunState } from './lib/types'

export default function App() {
  const [items, setItems] = useState<PlaylistItem[]>(() => {
    const loaded = loadPlaylist()
    return loaded.length
      ? loaded
      : [
          {
            id: crypto.randomUUID(),
            name: 'Example',
            url: 'https://example.com',
            durationSec: 30,
          },
        ]
  })

  const [run, setRun] = useState<RunState>(() => ({
    running: false,
    currentIndex: 0,
    loop: loadLoop(),
    status: 'Stopped.',
    countdownSec: null,
  }))

  const [airtableToken, setAirtableToken] = useState<string>(() => loadAirtableToken())
  const [showSettings, setShowSettings] = useState(false)
  const [bulkDurationSec, setBulkDurationSec] = useState(30)

  const popupRef = useRef<Window | null>(null)
  const timerRef = useRef<number | null>(null)
  const countdownTickRef = useRef<number | null>(null)
  const runRef = useRef<RunState | null>(null)
  const itemsRef = useRef(items)

  useEffect(() => {
    runRef.current = run
  }, [run])

  useEffect(() => {
    itemsRef.current = items
  }, [items])

  const current = items[run.currentIndex] ?? null
  const canStart = useMemo(() => playlistIsReady(items), [items])
  const isElectron = typeof window !== 'undefined' && Boolean(window.playback)

  useEffect(() => {
    savePlaylist(items)
  }, [items])

  useEffect(() => {
    saveLoop(run.loop)
  }, [run.loop])

  useEffect(() => {
    // Optional developer override only — do not pass a token on Load Today.
    if (!window.airtable) return
    const saved = loadAirtableToken().trim()
    if (saved) void window.airtable.setToken(saved)
  }, [])

  function clearTimers() {
    if (timerRef.current != null) window.clearTimeout(timerRef.current)
    if (countdownTickRef.current != null) window.clearTimeout(countdownTickRef.current)
    timerRef.current = null
    countdownTickRef.current = null
  }

  function ensurePopup(allowOpen: boolean): Window | null {
    const existing = popupRef.current
    if (existing && !existing.closed) return existing

    if (!allowOpen) {
      setRun((r) => ({
        ...r,
        running: false,
        countdownSec: null,
        status:
          'Playback window is not available. Click Open Current (or Start) to open it, then try again.',
      }))
      popupRef.current = null
      return null
    }

    const res = openOrReusePopup()
    if (!res.ok) {
      setRun((r) => ({
        ...r,
        running: false,
        countdownSec: null,
        status:
          res.reason === 'blocked'
            ? 'Popup blocked. Allow popups for this site, then click Start/Open Current again.'
            : 'Playback window closed. Click Start/Open Current to reopen.',
      }))
      popupRef.current = null
      return null
    }

    popupRef.current = res.popup
    writePopupHelperPage(
      res.popup,
      'SCOR Rotator',
      'Playback window ready. If audio is muted, click once inside this window to allow audio.',
    )
    return res.popup
  }

  function openCurrent() {
    if (!current) {
      setRun((r) => ({ ...r, status: 'Playlist is empty.' }))
      return
    }

    if (window.playback) {
      void (async () => {
        await window.playback!.open(current.url)
        setRun((r) => ({ ...r, status: `Opened: ${current.name || current.url}` }))
      })()
      return
    }

    const popup = ensurePopup(true)
    if (!popup) return
    const nav = navigatePopup(popup, current.url)
    if (!nav.ok) {
      setRun((r) => ({
        ...r,
        status: 'Could not navigate playback window (closed or blocked by browser).',
      }))
      popupRef.current = null
      return
    }
    setRun((r) => ({ ...r, status: `Opened: ${current.name || current.url}` }))
  }

  function startCountdown() {
    if (countdownTickRef.current != null) window.clearTimeout(countdownTickRef.current)
    const tick = () => {
      setRun((r) => {
        if (!r.running || r.countdownSec == null) return r
        return { ...r, countdownSec: Math.max(0, r.countdownSec - 1) }
      })
      countdownTickRef.current = window.setTimeout(tick, 1000)
    }
    countdownTickRef.current = window.setTimeout(tick, 1000)
  }

  function stepToIndex(nextIndex: number) {
    const list = itemsRef.current
    const next = list[nextIndex]
    if (!next) {
      setRun((r) => ({ ...r, running: false, status: 'No next item.' }))
      return
    }

    const duration = clampInt(next.durationSec, 1)

    if (window.playback) {
      void (async () => {
        const t = `Playback — ${next.name || next.url}`
        await window.playback!.navigate(next.url)
        await window.playback!.setTitle(t)
        setRun((r) => ({
          ...r,
          currentIndex: nextIndex,
          status: `Playing: ${next.name || next.url}`,
          countdownSec: duration,
        }))
      })()
      startCountdown()
      if (timerRef.current != null) window.clearTimeout(timerRef.current)
      timerRef.current = window.setTimeout(() => rotateFrom(nextIndex), duration * 1000)
      return
    }

    const popup = (() => {
      try {
        const p = window.open('', 'scor-rotator-playback')
        if (!p || p.closed) return null
        return p
      } catch {
        return null
      }
    })()

    if (!popup) {
      setRun((r) => ({
        ...r,
        running: false,
        countdownSec: null,
        status:
          'Playback window is not available. Click Open Current to open it again, then press Start.',
      }))
      clearTimers()
      popupRef.current = null
      return
    }

    writePopupHelperPage(popup, 'Switching…', `Loading next stream in 1s: ${next.name || next.url}`)

    setRun((r) => ({
      ...r,
      currentIndex: nextIndex,
      status: `Switching to: ${next.name || next.url}`,
      countdownSec: duration,
    }))
    startCountdown()

    window.setTimeout(() => {
      const nav = navigatePopup(popup, next.url)
      if (!nav.ok) {
        setRun((r) => ({
          ...r,
          running: false,
          status: 'Playback window was closed. Rotation stopped.',
        }))
        popupRef.current = null
        clearTimers()
        return
      }
      setRun((r) => ({ ...r, status: `Playing: ${next.name || next.url}` }))
    }, 1000)

    if (timerRef.current != null) window.clearTimeout(timerRef.current)
    timerRef.current = window.setTimeout(() => rotateFrom(nextIndex), duration * 1000)
  }

  function closePopupIfPossible() {
    const p = popupRef.current
    if (!p) return
    try {
      if (!p.closed) p.close()
    } catch {
      // ignore
    }
    popupRef.current = null
  }

  function rotateFrom(index: number) {
    const latest = runRef.current
    if (!latest?.running) return

    const list = itemsRef.current
    const nextIndex = nextRotationIndex(index, list.length, latest.loop)
    if (nextIndex == null) {
      setRun((r) => ({
        ...r,
        running: false,
        status: 'Reached end of playlist (loop off).',
        countdownSec: null,
      }))
      clearTimers()
      return
    }

    closePopupIfPossible()
    stepToIndex(nextIndex)
  }

  function start() {
    if (!playlistIsReady(items)) {
      setRun((r) => ({
        ...r,
        running: false,
        status: 'Fix URLs (http/https) and durations (> 0) before starting.',
      }))
      return
    }

    clearTimers()

    if (window.playback) {
      setRun((r) => ({ ...r, running: true, status: 'Starting…' }))
      stepToIndex(Math.min(run.currentIndex, items.length - 1))
      return
    }

    const popup = ensurePopup(true)
    if (!popup) return
    popupRef.current = popup
    setRun((r) => ({ ...r, running: true, status: 'Starting…' }))
    stepToIndex(Math.min(run.currentIndex, items.length - 1))
  }

  function stop() {
    clearTimers()
    setRun((r) => ({ ...r, running: false, status: 'Stopped.', countdownSec: null }))
  }

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.code !== 'Space') return
      const target = e.target as HTMLElement | null
      const tag = target?.tagName?.toLowerCase()
      if (
        tag === 'input' ||
        tag === 'textarea' ||
        target?.getAttribute('contenteditable') === 'true'
      ) {
        return
      }
      e.preventDefault()
      if (runRef.current?.running) stop()
      else start()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, run.currentIndex, run.loop])

  function updateItem(id: string, patch: Partial<PlaylistItem>) {
    setItems((prev) => prev.map((x) => (x.id === id ? { ...x, ...patch } : x)))
  }

  function deleteItem(id: string) {
    setItems((prev) => {
      const next = prev.filter((x) => x.id !== id)
      setRun((r) => ({
        ...r,
        currentIndex: Math.min(r.currentIndex, Math.max(0, next.length - 1)),
      }))
      return next
    })
  }

  function addItem() {
    setItems((prev) => [...prev, { id: crypto.randomUUID(), name: '', url: '', durationSec: 30 }])
  }

  async function loadTodayFromAirtable() {
    if (!window.airtable) {
      setRun((r) => ({
        ...r,
        status: 'Airtable loader is only available in the Electron app.',
      }))
      return
    }

    try {
      setRun((r) => ({ ...r, status: 'Loading today view…' }))
      const res = await window.airtable.loadTodayView()
      const nextItems: PlaylistItem[] = res.items.map((x) => ({
        id: crypto.randomUUID(),
        name: x.name,
        url: x.url,
        durationSec: 30,
      }))
      setItems(nextItems)
      setRun((r) => ({
        ...r,
        currentIndex: 0,
        status: nextItems.length
          ? `Loaded ${nextItems.length} streams from Airtable.`
          : 'No streams returned by Airtable view.',
      }))
    } catch (e) {
      setRun((r) => ({
        ...r,
        status: `Airtable load failed: ${e instanceof Error ? e.message : String(e)}`,
      }))
    }
  }

  function applyDurationToAll() {
    const d = clampInt(bulkDurationSec, 1)
    setItems((prev) => prev.map((x) => ({ ...x, durationSec: d })))
    setRun((r) => ({ ...r, status: `Applied ${d}s duration to all streams.` }))
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header-inner">
          <div className="app-brand-row">
            <div className="app-title-block">
              <Logo variant="secondary-dark" height={32} />
              <h1>SCOR Rotator</h1>
              <p>
                Rotates a playback window through stream URLs from Airtable. No iframes. Audio
                depends on provider autoplay policy.
              </p>
            </div>
            <div className="toolbar">
              {isElectron ? (
                <>
                  <button className="btn" type="button" onClick={() => setShowSettings((v) => !v)}>
                    Settings
                  </button>
                  <button
                    className="btn btn-accent"
                    type="button"
                    onClick={() => void loadTodayFromAirtable()}
                  >
                    Load Today
                  </button>
                </>
              ) : null}

              <div className="bulk-duration">
                <span>All</span>
                <input
                  className="field"
                  style={{ width: '4.5rem' }}
                  type="number"
                  min={1}
                  value={bulkDurationSec}
                  onChange={(e) => setBulkDurationSec(clampInt(Number(e.target.value), 1))}
                />
                <button className="btn" type="button" onClick={applyDurationToAll}>
                  Apply
                </button>
              </div>

              <button className="btn" type="button" onClick={addItem}>
                Add URL
              </button>
              <button
                className="btn btn-primary"
                type="button"
                onClick={start}
                disabled={!canStart || run.running}
              >
                Start
              </button>
              <button className="btn" type="button" onClick={stop} disabled={!run.running}>
                Stop
              </button>
              <button className="btn" type="button" onClick={openCurrent}>
                Open Current
              </button>
            </div>
          </div>

          {isElectron && showSettings ? (
            <div className="settings-panel">
              <div className="app-brand-row">
                <h2>Settings</h2>
                <button className="btn" type="button" onClick={() => setShowSettings(false)}>
                  Close
                </button>
              </div>
              <p style={{ marginTop: '0.75rem', opacity: 0.85 }}>
                Packaged apps load today’s streams automatically — no API key needed. The field
                below is only for developers who want a local Airtable token override.
              </p>
              <details style={{ marginTop: '0.75rem' }}>
                <summary>Advanced: Airtable token override</summary>
                <div style={{ marginTop: '0.75rem' }}>
                  <label htmlFor="airtable-token">Airtable Personal Access Token</label>
                  <input
                    id="airtable-token"
                    className="field"
                    placeholder="Leave empty to use the streams proxy / .env"
                    value={airtableToken}
                    onChange={(e) => setAirtableToken(e.target.value)}
                  />
                  <div className="toolbar" style={{ marginTop: '0.5rem' }}>
                    <button
                      className="btn btn-primary"
                      type="button"
                      onClick={() => {
                        saveAirtableToken(airtableToken.trim())
                        void window.airtable?.setToken(airtableToken.trim())
                        setRun((r) => ({
                          ...r,
                          status: 'Saved Airtable token override locally on this computer.',
                        }))
                      }}
                    >
                      Save Token
                    </button>
                    <button
                      className="btn"
                      type="button"
                      onClick={() => {
                        setAirtableToken('')
                        saveAirtableToken('')
                        void window.airtable?.setToken('')
                        setRun((r) => ({ ...r, status: 'Cleared Airtable token override.' }))
                      }}
                    >
                      Clear
                    </button>
                  </div>
                </div>
              </details>
            </div>
          ) : null}
        </div>
      </header>

      <main className="app-main">
        <section className="panel">
          <div className="panel-header">
            <h2>Playlist</h2>
            <label className="loop-label">
              <input
                type="checkbox"
                checked={run.loop}
                onChange={(e) => setRun((r) => ({ ...r, loop: e.target.checked }))}
              />
              Loop
            </label>
          </div>
          <div className="panel-body">
            <div className="grid-head">
              <div>Name</div>
              <div>URL</div>
              <div>Duration (s)</div>
              <div />
            </div>
            {items.map((x, idx) => {
              const active = run.running && idx === run.currentIndex
              const urlOk = isValidHttpUrl(x.url)
              const durOk = clampInt(x.durationSec, 1) > 0
              return (
                <div key={x.id} className={`row${active ? ' active' : ''}`}>
                  <input
                    className="field"
                    placeholder="e.g. Channel A"
                    value={x.name}
                    onChange={(e) => updateItem(x.id, { name: e.target.value })}
                  />
                  <div>
                    <input
                      className={`field${urlOk || !x.url.trim() ? '' : ' invalid'}`}
                      placeholder="https://…"
                      value={x.url}
                      onChange={(e) => updateItem(x.id, { url: e.target.value })}
                    />
                    {!urlOk && x.url.trim() !== '' ? (
                      <div className="field-error">Invalid URL (must be http/https).</div>
                    ) : null}
                  </div>
                  <input
                    className={`field${durOk ? '' : ' invalid'}`}
                    type="number"
                    min={1}
                    value={x.durationSec}
                    onChange={(e) =>
                      updateItem(x.id, { durationSec: clampInt(Number(e.target.value), 1) })
                    }
                  />
                  <div className="row-actions">
                    <button
                      className="icon-btn"
                      type="button"
                      title="Set current"
                      onClick={() => setRun((r) => ({ ...r, currentIndex: idx }))}
                    >
                      ▷
                    </button>
                    <button
                      className="icon-btn"
                      type="button"
                      title="Delete"
                      onClick={() => deleteItem(x.id)}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              )
            })}
            {!items.length ? (
              <div className="empty">No URLs yet. Click “Add URL” or Load Today.</div>
            ) : null}
          </div>
        </section>

        <aside style={{ display: 'grid', gap: '1.25rem' }}>
          <section className="panel">
            <div className="panel-header">
              <h2>Status</h2>
            </div>
            <div className="panel-body status-list">
              <div className="status-row">
                <span className="label">State</span>
                <span className={`value${run.running ? ' running' : ''}`}>
                  {run.running ? 'Running' : 'Stopped'}
                </span>
              </div>
              <div className="status-row">
                <span className="label">Current</span>
                <span>{current ? current.name || current.url : '—'}</span>
              </div>
              <div className="status-row">
                <span className="label">Countdown</span>
                <span>
                  {run.running && run.countdownSec != null ? `${run.countdownSec}s` : '—'}
                </span>
              </div>
              <div className="status-message">{run.status}</div>
            </div>
          </section>

          <section className="panel notes">
            <div className="panel-header">
              <h2>Audio notes</h2>
            </div>
            <div className="panel-body">
              <ul>
                <li>Many providers require a user click before audio can play.</li>
                <li>Click once inside the playback window if audio is silent.</li>
                <li>Desktop app uses a dedicated Electron playback window (not iframes).</li>
              </ul>
              <div className="hint">Shortcut: Space toggles Start/Stop (when not typing).</div>
            </div>
          </section>
        </aside>
      </main>

      <footer className="app-footer">
        SCOR Rotator · playlist in localStorage · Airtable via 1Password-mounted env
      </footer>
    </div>
  )
}
