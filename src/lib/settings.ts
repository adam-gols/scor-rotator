const KEY = 'scor-rotator.airtableToken.v1'

/** Optional local override for developers; packaged apps use the streams proxy. */
export function loadAirtableToken(): string {
  try {
    return localStorage.getItem(KEY) ?? ''
  } catch {
    return ''
  }
}

export function saveAirtableToken(token: string) {
  localStorage.setItem(KEY, token)
}
