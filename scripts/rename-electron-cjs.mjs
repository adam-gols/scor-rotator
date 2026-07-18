import fs from 'node:fs'
import path from 'node:path'

const out = 'electron-dist'
for (const f of ['main.js', 'preload.js']) {
  const from = path.join(out, f)
  if (fs.existsSync(from)) {
    fs.renameSync(from, path.join(out, f.replace(/\.js$/, '.cjs')))
  }
}
