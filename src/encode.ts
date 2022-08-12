import { promises as fs } from 'fs'
import { exit } from 'node:process'
import path from 'path'
import fg from 'fast-glob'
import CryptoJS from 'crypto-js'
import JavaScriptObfuscator from 'javascript-obfuscator'
import ts from 'typescript'
import JSON5 from 'json5'

import { CACHE_PATH, cwd, isDir, isUnixBashShellPath, loadCache, winPath } from './utils'
const cache = loadCache()
async function encode(entry: string | string[], key: string) {
  let files = []
  if (typeof entry === 'string') {
    files = await getFiles(entry)
  }
  else {
    for (const i of entry)
      files.push(await getFiles(i))
  }
  await transform(files, key)
  await save()
}
async function getFiles(entry: string) {
  if (isUnixBashShellPath(entry) || !isDir(winPath(path.join(cwd, entry))))
    return await fg(entry)
  else
    return await fg(`${entry}/**/*.{js,ts,cjs,mjs}`)
}
async function transform(files: string[] | string[][], key: string) {
  for (const file of files) {
    if (Array.isArray(file)) {
      await transform(file, key)
    }
    else {
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
        funnycode = `/** funnycode symbol */
        ${funnycode}`
        if (isTs) {
          funnycode = `/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
${funnycode}`
        }
        funnycode = `/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
${funnycode}`

        await fs.writeFile(absolutePath, funnycode)
        console.log(`done ${file}`)
      }
    }
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
  const configPath = ts.findConfigFile(
    cwd,
    ts.sys.fileExists,
    'tsconfig.json',
  )
  if (!configPath)
    throw new Error('Could not find a valid \'tsconfig.json\'.')

  const tsconfig = await fs.readFile(configPath, 'utf8')
  const { compilerOptions = {} } = JSON5.parse(tsconfig)
  const { outputText } = ts.transpileModule(code, { compilerOptions: { module: compilerOptions.module } })
  return outputText
}

async function save() {
  await fs.writeFile(CACHE_PATH, JSON.stringify(cache, null, 2))
  exit(0)
}
export default encode
