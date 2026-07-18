import { describe, expect, it } from 'vitest'
import { clampInt, isValidHttpUrl, nextRotationIndex, playlistIsReady } from './playlist'

describe('playlist helpers', () => {
  it('validates http(s) URLs', () => {
    expect(isValidHttpUrl('https://example.com')).toBe(true)
    expect(isValidHttpUrl('http://example.com/live')).toBe(true)
    expect(isValidHttpUrl('ftp://example.com')).toBe(false)
    expect(isValidHttpUrl('not-a-url')).toBe(false)
  })

  it('clamps integers', () => {
    expect(clampInt(30.9, 1)).toBe(30)
    expect(clampInt(-2, 1)).toBe(1)
    expect(clampInt(Number.NaN, 1)).toBe(1)
  })

  it('computes next rotation index with loop', () => {
    expect(nextRotationIndex(0, 3, true)).toBe(1)
    expect(nextRotationIndex(2, 3, true)).toBe(0)
    expect(nextRotationIndex(2, 3, false)).toBeNull()
  })

  it('checks playlist readiness', () => {
    expect(playlistIsReady([{ id: '1', name: 'A', url: 'https://a.test', durationSec: 10 }])).toBe(
      true,
    )
    expect(playlistIsReady([{ id: '1', name: 'A', url: 'bad', durationSec: 10 }])).toBe(false)
    expect(playlistIsReady([])).toBe(false)
  })
})
