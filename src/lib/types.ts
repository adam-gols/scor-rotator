export type PlaylistItem = {
  id: string
  name: string
  url: string
  durationSec: number
}

export type RunState = {
  running: boolean
  currentIndex: number
  loop: boolean
  status: string
  countdownSec: number | null
}
