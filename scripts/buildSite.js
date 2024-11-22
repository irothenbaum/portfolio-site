import compilePages from './compilePages.js'
import compileStyles from './compileStyles.js'
import copyAssets from './copyAssets.js'
import buildSubModule from './buildSubModule.js'
import {BUILD_DIR} from './constants.js'
import fs from 'fs'

async function buildSite() {
  console.log('Building site...')

  if (!fs.existsSync(BUILD_DIR)) {
    fs.mkdirSync(BUILD_DIR)
  }

  await compilePages()
  await compileStyles()
  await copyAssets()

  await buildSubModule('game-clock')
  await buildSubModule('mehmoh')
  await buildSubModule('premove')

  console.log('Site built to build folder')
}

export default buildSite
