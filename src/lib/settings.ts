const KEY = 'scor-rotator.airtableToken.v1'

/** Optional local override; prefer AIRTABLE_TOKEN from mounted .env in Electron. */
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
