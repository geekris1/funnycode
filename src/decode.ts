import { promises as fs } from 'fs'
import { exit } from 'node:process'
import path from 'path'
import CryptoJS from 'crypto-js'

import { CACHE_PATH, cwd, error, loadCache, winPath } from './utils'

async function decode(key: string) {
  const cache = loadCache()
  if (!cache || Object.keys(cache).length === 0)
    error(3)
  const cacheArray = Object.entries(cache)
  for (const c of cacheArray) {
    const [file, code] = c
    const decryptCode = crypto(code, key)
    await fs.writeFile(winPath(path.join(cwd, file)), decryptCode)
    console.log(`done ${file}`)
  }
  await save()
}

function crypto(code: string, key: string) {
  return CryptoJS.AES.decrypt(code, key).toString(CryptoJS.enc.Utf8)
}
async function save() {
  await fs.writeFile(CACHE_PATH, '{}')
  exit(0)
}

export default decode
