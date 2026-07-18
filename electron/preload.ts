import { contextBridge, ipcRenderer } from 'electron'

export type PlaybackApi = {
  open: (url: string) => Promise<{ ok: true }>
  navigate: (url: string) => Promise<{ ok: true; reopened: boolean }>
  close: () => Promise<{ ok: true }>
  setTitle: (title: string) => Promise<{ ok: true }>
  onClosed: (cb: () => void) => () => void
}

export type AirtableApi = {
  setToken: (token: string) => Promise<{ ok: true }>
  loadTodayView: (token?: string) => Promise<{
    ok: true
    items: Array<{ name: string; url: string }>
  }>
}

const playback: PlaybackApi = {
  open: (url) => ipcRenderer.invoke('playback:open', url),
  navigate: (url) => ipcRenderer.invoke('playback:navigate', url),
  close: () => ipcRenderer.invoke('playback:close'),
  setTitle: (title) => ipcRenderer.invoke('playback:setTitle', title),
  onClosed: (cb) => {
    const handler = () => cb()
    ipcRenderer.on('playback:closed', handler)
    return () => ipcRenderer.off('playback:closed', handler)
  },
}

const airtable: AirtableApi = {
  setToken: (token) => ipcRenderer.invoke('airtable:setToken', token),
  loadTodayView: (token) => ipcRenderer.invoke('airtable:loadTodayView', token),
}

contextBridge.exposeInMainWorld('playback', playback)
contextBridge.exposeInMainWorld('airtable', airtable)
