import path from 'path'
import {BUILD_DIR, SRC_DIR} from './constants.js'
import fs from 'fs'
import * as sass from 'sass'

async function compileStyles() {
  console.log('Compiling styles...')
  const sassDir = path.join(SRC_DIR, 'styles')
  const styles = fs.readdirSync(sassDir)

  if (!fs.existsSync(path.join(BUILD_DIR, 'styles'))) {
    fs.mkdirSync(path.join(BUILD_DIR, 'styles'))
  }

  for (const file of styles) {
    if (fs.lstatSync(path.join(sassDir, file)).isDirectory()) {
      continue
    }
    console.log(`Compiling ${file}`)
    const styleName = file.split('.')[0]
    const result = sass.compile(path.join(sassDir, file))

    fs.writeFileSync(
      path.join(BUILD_DIR, 'styles', `${styleName}.css`),
      result.css,
    )
    console.log(`- ${styleName}`)
  }

  console.log('Styles compiled')
}

export default compileStyles
