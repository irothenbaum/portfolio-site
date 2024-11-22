import path from 'path'
import {fileURLToPath} from 'url'
import {dirname} from 'path'

/**
 * @param {string} metaUrl
 * @returns {string}
 */
export function getDirName(metaUrl) {
  const __filename = fileURLToPath(metaUrl)
  return dirname(__filename)
}

const __dirname = getDirName(import.meta.url)

export const SRC_DIR = path.join(__dirname, '../src')
export const BUILD_DIR = path.join(__dirname, '../build')
