import type { AirtableApi, PlaybackApi } from '../electron/preload'

declare global {
  interface Window {
    playback?: PlaybackApi
    airtable?: AirtableApi
  }
}

export {}
