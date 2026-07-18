#!/usr/bin/env node
/**
 * Bake SCOR_STREAMS_API_URL into electron/main.ts before electron:build.
 * Safe to run without the env var (keeps the committed default).
 *
 * Kept inline in main.ts (not a separate module) so packaged builds never
 * hit ESM/CJS issues under root package.json "type": "module".
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const mainTs = path.join(root, 'electron', 'main.ts')
const fromEnv = (process.env.SCOR_STREAMS_API_URL || '').trim().replace(/\/$/, '')

if (!fromEnv) {
  console.log('[streams-api-url] SCOR_STREAMS_API_URL unset — keeping', mainTs)
  process.exit(0)
}

const src = fs.readFileSync(mainTs, 'utf8')
const next = src.replace(
  /const BAKED_STREAMS_API_URL = (['"`])(?:\\\1|.)*?\1/,
  `const BAKED_STREAMS_API_URL = ${JSON.stringify(fromEnv)}`,
)

if (next === src) {
  console.error(
    '[streams-api-url] Could not find BAKED_STREAMS_API_URL assignment in electron/main.ts',
  )
  process.exit(1)
}

fs.writeFileSync(mainTs, next)
console.log('[streams-api-url] wrote', fromEnv, '→', mainTs)
