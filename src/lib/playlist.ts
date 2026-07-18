import type { PlaylistItem } from './types'

export function isValidHttpUrl(value: string): boolean {
  const v = value.trim()
  if (!v) return false
  try {
    const u = new URL(v)
    return u.protocol === 'http:' || u.protocol === 'https:'
  } catch {
    return false
  }
}

export function clampInt(n: number, min: number): number {
  if (!Number.isFinite(n)) return min
  return Math.max(min, Math.trunc(n))
}

/** Next index after `index`, or null when loop is off and playlist ended. */
export function nextRotationIndex(index: number, length: number, loop: boolean): number | null {
  if (length <= 0) return null
  const atLast = index >= length - 1
  if (atLast && !loop) return null
  return atLast ? 0 : index + 1
}

export function playlistIsReady(items: PlaylistItem[]): boolean {
  if (!items.length) return false
  return items.every((x) => isValidHttpUrl(x.url) && clampInt(x.durationSec, 1) > 0)
}
