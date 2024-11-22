import fs from 'fs'
import path from 'path'
import {getDirName} from './constants.js'

const __dirname = getDirName(import.meta.url)

async function run() {
  const script = process.argv[2]
  if (!script) {
    throw new Error('No script provided')
  }
  if (script === 'runScript' || script === 'deploySite') {
    throw new Error('Cannot run this script')
  }

  const filePath = path.join(__dirname, script + '.js')
  if (!fs.existsSync(filePath)) {
    throw new Error(`Script "${script}" does not exist`)
  }

  console.log(`Running ${filePath}...`)

  const scriptFunc = await import('./' + script + '.js')
  await scriptFunc.default()
}

run()
  .then(() => {
    console.log('- DONE- ')
  })
  .catch(err => {
    console.error(err)
  })
