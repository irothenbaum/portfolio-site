import {execSync} from 'child_process'
import path from 'path'
import {BUILD_DIR, getDirName} from './constants.js'

async function buildSubModule(moduleName) {
  console.log(`Building sub-module ${moduleName}...`)

  const moduleFolderPath = path.join(
    getDirName(import.meta.url),
    '..',
    moduleName,
  )

  execSync(`cd ${moduleFolderPath} && npm run build`, {
    stdio: 'inherit',
  })

  console.log(`Finished building sub-module ${moduleName}`)

  // all the submodules right now have the same vite build config:
  // same build command and output dist folder
  // if that changes in the future, this will need to be updated
  execSync(`mv ${moduleFolderPath}/dist ${path.join(BUILD_DIR, moduleName)}`, {
    stdio: 'inherit',
  })

  console.log(`${moduleName} built to build folder`)
}

export default buildSubModule
