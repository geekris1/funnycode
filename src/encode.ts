import { promises as fs } from 'fs'
import path from 'path'
import fg from 'fast-glob'
import CryptoJS from 'crypto-js'
import JavaScriptObfuscator from 'javascript-obfuscator'
import ts from 'typescript'

import { CACHE_PATH, cwd, error, getKey, isDir, isUnixBashShellPath, loadCache, winPath } from './utils.js'
const cache = loadCache()
async function encode(entry: string, key: string) {
  let files
  if (isUnixBashShellPath(entry) || !isDir(winPath(path.join(cwd, entry))))
    files = await fg(entry)
  else
    files = await fg(`${entry}/**/*.{js,ts,cjs,mjs}`)

  for (const file of files)
    await transform(file, key)

  await save()
}
// TODO : handle ts(extname) file
async function transform(file: string, key: string) {
  const absolutePath = winPath(path.join(cwd, file))
  let code = await fs.readFile(absolutePath, 'utf8')
  if (/funnycode/.test(code)) {
    console.error(`${file} already encoded , Please decode first.`)
  }
  else {
    cache[file] = crypto(code, key)
    const isTs = path.extname(file) === '.ts'
    if (isTs)
      code = await toJavascript(code)

    let funnycode = obfuscator(code)
    funnycode = `// @ts-nocheck
${funnycode}
/** funnycode symbol*/`
    await fs.writeFile(absolutePath, funnycode)
  }
}

function crypto(code: string, key: string) {
  // Encrypt
  return CryptoJS.AES.encrypt(code, key).toString()
}
function obfuscator(code: string) {
  const obfuscationResult = JavaScriptObfuscator.obfuscate(code)
  return obfuscationResult.getObfuscatedCode()
}

async function toJavascript(code: string) {
  const { compilerOptions = {} } = JSON.parse(await fs.readFile(winPath(path.join(cwd, 'tsconfig.json')), 'utf8'))
  const { outputText } = ts.transpileModule(code, { compilerOptions: { module: compilerOptions.module } })
  return outputText
}

async function save() {
  await fs.writeFile(CACHE_PATH, JSON.stringify(cache, null, 2))
  console.log('game over!', 'encode save')
}
export default encode
