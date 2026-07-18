/**
 * Public streams proxy base URL (not a secret).
 * Release CI overwrites this via scripts/write-streams-api-url.mjs when
 * SCOR_STREAMS_API_URL is set. Update the default after first Worker deploy.
 */
export const STREAMS_API_URL = 'https://scor-rotator-streams.gols.workers.dev'
