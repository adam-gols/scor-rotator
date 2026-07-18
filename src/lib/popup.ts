export type PopupResult =
  { ok: true; popup: Window } | { ok: false; reason: 'blocked' | 'closed' | 'unknown' }

const POPUP_NAME = 'scor-rotator-playback'

function getPopupFeatures() {
  const w = 1280
  const h = 720
  const left = Math.max(0, Math.round((window.screen.width - w) / 2))
  const top = Math.max(0, Math.round((window.screen.height - h) / 2))

  return [
    'popup=yes',
    'resizable=yes',
    'scrollbars=yes',
    'toolbar=no',
    'menubar=no',
    'location=yes',
    'status=no',
    `width=${w}`,
    `height=${h}`,
    `left=${left}`,
    `top=${top}`,
  ].join(',')
}

export function openOrReusePopup(): PopupResult {
  try {
    if (window.playback) {
      return { ok: false, reason: 'unknown' }
    }

    let popup = window.open('', POPUP_NAME)
    if (!popup) popup = window.open('', POPUP_NAME, getPopupFeatures())

    if (!popup) return { ok: false, reason: 'blocked' }
    if (popup.closed) return { ok: false, reason: 'closed' }

    try {
      popup.focus()
    } catch {
      // ignore
    }

    return { ok: true, popup }
  } catch {
    return { ok: false, reason: 'unknown' }
  }
}

export function navigatePopup(popup: Window, url: string) {
  try {
    if (popup.closed) return { ok: false as const, reason: 'closed' as const }
    popup.location.href = url
    popup.focus()
    return { ok: true as const }
  } catch {
    return { ok: false as const, reason: 'unknown' as const }
  }
}

export function writePopupHelperPage(popup: Window, title: string, message: string) {
  try {
    popup.document.open()
    popup.document.write(`<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${title}</title>
<style>
  body{font-family:'Roboto',sans-serif;padding:24px;background:#0f1c41;color:#f0efef}
  .card{max-width:720px;margin:0 auto;padding:16px;border:1px solid #37605f;background:#0f1c41}
  h1{margin:0 0 8px 0;font-size:18px;font-family:'Oswald',sans-serif;text-transform:uppercase}
  p{margin:0;line-height:1.5;color:#c7c9c7}
</style>
</head>
<body>
  <div class="card">
    <h1>${title}</h1>
    <p>${message}</p>
  </div>
</body>
</html>`)
    popup.document.close()
  } catch {
    // ignore
  }
}
