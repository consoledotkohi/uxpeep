import fs from 'fs'
import path from 'path'
import { glob } from 'glob'

const outDir = path.resolve('dist/styles')
const outFile = path.join(outDir, 'peep.css')

const files = glob.sync('src/**/*.module.css')

// CSS 병합
let combined = ''

for (const file of files) {
  const content = fs.readFileSync(file, 'utf-8')
  combined += `\n/* ${path.basename(file)} */\n` + content
}

fs.mkdirSync(outDir, { recursive: true })
fs.writeFileSync(outFile, combined)
