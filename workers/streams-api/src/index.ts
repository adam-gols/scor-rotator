/**
 * Public streams proxy for SCOR Rotator.
 * Holds AIRTABLE_TOKEN server-side; packaged apps call GET /today with no keys.
 */

type Env = {
  AIRTABLE_TOKEN: string
  AIRTABLE_BASE_ID: string
  AIRTABLE_TABLE_ID: string
  AIRTABLE_VIEW_ID: string
}

type AirtableRecord = {
  id: string
  fields: Record<string, unknown>
}

type StreamItem = { name: string; url: string }

function toStringVal(v: unknown): string {
  if (typeof v === 'string') return v
  if (typeof v === 'number') return String(v)
  return ''
}

function extractUrl(v: unknown): string {
  if (typeof v === 'string') return v
  if (Array.isArray(v)) {
    const first = v[0] as { url?: string } | string | undefined
    if (typeof first === 'string') return first
    if (first && typeof first === 'object' && typeof first.url === 'string') return first.url
    return ''
  }
  if (v && typeof v === 'object' && typeof (v as { url?: string }).url === 'string') {
    return (v as { url: string }).url
  }
  return ''
}

async function fetchTodayStreams(env: Env): Promise<StreamItem[]> {
  const token = (env.AIRTABLE_TOKEN || '').trim()
  if (!token) throw new Error('AIRTABLE_TOKEN secret is not configured on this Worker')

  const out: StreamItem[] = []
  let offset: string | undefined

  for (let i = 0; i < 50; i++) {
    const url = new URL(
      `https://api.airtable.com/v0/${env.AIRTABLE_BASE_ID}/${env.AIRTABLE_TABLE_ID}`,
    )
    url.searchParams.set('view', env.AIRTABLE_VIEW_ID)
    url.searchParams.set('pageSize', '100')
    if (offset) url.searchParams.set('offset', offset)

    const res = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${token}` },
    })

    if (!res.ok) {
      const text = await res.text().catch(() => '')
      throw new Error(`Airtable request failed (${res.status}): ${text || res.statusText}`)
    }

    const data = (await res.json()) as { records: AirtableRecord[]; offset?: string }

    for (const r of data.records ?? []) {
      const name = toStringVal(r.fields['Channel Title']).trim()
      const streamUrl = extractUrl(r.fields['Stream Link']).trim()
      if (name && streamUrl) out.push({ name, url: streamUrl })
    }

    if (!data.offset) break
    offset = data.offset
  }

  return out
}

function corsHeaders(): HeadersInit {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }
}

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      ...corsHeaders(),
    },
  })
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders() })
    }

    const { pathname } = new URL(request.url)

    if (request.method === 'GET' && (pathname === '/' || pathname === '/health')) {
      return json({ ok: true, service: 'scor-rotator-streams' })
    }

    if (request.method === 'GET' && pathname === '/today') {
      try {
        const items = await fetchTodayStreams(env)
        return json({ ok: true, items })
      } catch (e) {
        const message = e instanceof Error ? e.message : String(e)
        return json({ ok: false, error: message }, 502)
      }
    }

    return json({ ok: false, error: 'Not found' }, 404)
  },
}
