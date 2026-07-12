// Static-export build for GitHub Pages (rithvikillandula.github.io/My-Portfolio).
// The edge route app/api/chat is incompatible with `output: export`, so it is
// moved aside for the build and restored afterward (finally, always restores).
import { execSync } from 'node:child_process'
import { renameSync, existsSync, rmSync } from 'node:fs'

const API = 'app/api'
const BAK = '.api-bak'
let moved = false

// Ctrl-C during the build must still restore app/api (finally doesn't run on SIGINT)
function restore() {
  if (moved && existsSync(BAK)) { try { renameSync(BAK, API); moved = false } catch {} }
}
process.on('SIGINT', () => { restore(); process.exit(130) })
process.on('SIGTERM', () => { restore(); process.exit(143) })

try {
  if (existsSync(API)) {
    if (existsSync(BAK)) rmSync(BAK, { recursive: true, force: true })
    renameSync(API, BAK)
    moved = true
  }
  rmSync('.next', { recursive: true, force: true })
  rmSync('out', { recursive: true, force: true })
  execSync('next build', {
    stdio: 'inherit',
    env: { ...process.env, NEXT_PUBLIC_BASE_PATH: '/My-Portfolio' },
  })
} finally {
  restore()
}
