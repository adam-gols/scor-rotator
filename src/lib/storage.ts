import type { PlaylistItem } from './types'

const PLAYLIST_KEY = 'scor-rotator.playlist.v1'
const LOOP_KEY = 'scor-rotator.loop.v1'

export function loadPlaylist(): PlaylistItem[] {
  try {
    const raw = localStorage.getItem(PLAYLIST_KEY)
    if (!raw) return []
    const data = JSON.parse(raw) as unknown
    if (!Array.isArray(data)) return []
    return data
      .filter((x) => x && typeof x === 'object')
      .map((x: Record<string, unknown>) => ({
        id: String(x.id ?? crypto.randomUUID()),
        name: String(x.name ?? ''),
        url: String(x.url ?? ''),
        durationSec: Number(x.durationSec ?? x.duration ?? 30),
      }))
      .filter((x) => x.url.trim() !== '' && Number.isFinite(x.durationSec))
  } catch {
    return []
  }
}

export function savePlaylist(items: PlaylistItem[]) {
  localStorage.setItem(PLAYLIST_KEY, JSON.stringify(items))
}

export function loadLoop(): boolean {
  try {
    const raw = localStorage.getItem(LOOP_KEY)
    if (raw == null) return true
    return raw === 'true'
  } catch {
    return true
  }
}

export function saveLoop(loop: boolean) {
  localStorage.setItem(LOOP_KEY, String(loop))
}
