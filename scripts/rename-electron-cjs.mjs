import fs from 'node:fs'
import path from 'node:path'

/**
 * Root package.json is "type": "module", so electron-dist/*.js would be treated as ESM.
 * Compile output is CommonJS — rename to .cjs and fix relative requires.
 */
const out = 'electron-dist'
if (!fs.existsSync(out)) process.exit(0)

fs.writeFileSync(
  path.join(out, 'package.json'),
  `${JSON.stringify({ type: 'commonjs' }, null, 2)}\n`,
)

for (const f of fs.readdirSync(out)) {
  if (!f.endsWith('.js')) continue

  const from = path.join(out, f)
  const to = path.join(out, f.replace(/\.js$/, '.cjs'))
  let src = fs.readFileSync(from, 'utf8')

  // Only rewrite relative requires (./foo → ./foo.cjs)
  src = src.replace(/require\("(\.\/[^"]+)"\)/g, (full, spec) => {
    if (spec.endsWith('.cjs') || spec.endsWith('.json') || spec.endsWith('.node')) {
      return full
    }
    if (spec.endsWith('.js')) {
      return `require("${spec.slice(0, -3)}.cjs")`
    }
    return `require("${spec}.cjs")`
  })

  fs.writeFileSync(to, src)
  fs.unlinkSync(from)
}
