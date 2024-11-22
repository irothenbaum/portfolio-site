import fs from 'fs'
import path from 'path'
import {BUILD_DIR, SRC_DIR} from './constants.js'

const assetDirectories = ['images', 'fonts', 'scripts']

async function copyAssets() {
  for (const dir of assetDirectories) {
    copyAllFilesInDir(path.join(SRC_DIR, dir), path.join(BUILD_DIR, dir))
  }

  // last we copy root assets to the root folder
  copyAllFilesInDir(path.join(SRC_DIR, 'rootAssets'), path.join(BUILD_DIR))
}

function copyAllFilesInDir(sourceDir, targetDir) {
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir)
  }
  console.log(`Copying Directory ${sourceDir} to ${targetDir}...`)
  const files = fs.readdirSync(sourceDir)

  for (const file of files) {
    console.log(`Copying "${file}"`)
    const sourceFilePath = path.join(sourceDir, file)
    const targetFilePath = path.join(targetDir, file)

    if (fs.lstatSync(sourceFilePath).isDirectory()) {
      copyAllFilesInDir(sourceFilePath, targetFilePath)
    } else {
      fs.copyFileSync(sourceFilePath, targetFilePath)
    }
  }
}

export default copyAssets
