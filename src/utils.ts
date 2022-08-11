import { cwd as c } from 'node:process'
import fs from 'fs'
import path from 'path'

export const cwd = c()

export const KEYFILE = '.funnycode'
export const CONFIG = 'funnycode.config'
export const CACHE_PATH = winPath(path.join(cwd, 'funnycode.cache.json'))

export function isDir(url: string) {
  return fs.lstatSync(url).isDirectory()
}

// src/**/*.*
export function isUnixBashShellPath(url: string) {
  return /\/?\*{1,2}\/?/.test(url)
}
export function winPath(url: string) {
  return url.replace(/\\/g, '/')
}

const errorMessage = {
  0: 'Can not find a command, Please use funnycode encode/decode <path>',
  1: 'Can not find entry config, Please use funnycode encode/decode <path> Or set in the funny.config entry',
  2: 'Can not find key, Please use funnycode encode/decode <path> --key <key> Or add .funnycode file',
  3: 'Please encode first , funnycode encode <path>',
}
export function error(code: 0 | 1 | 2 | 3) {
  console.error(errorMessage[code])
  process.exit(1)
}

export function getKey() {
  let key
  try { key = fs.readFileSync(KEYFILE, 'utf8') }
  catch (e) {
    key = undefined
  }

  return key
}

let cache: any
export function loadCache() {
  if (cache)
    return cache
  try { cache = JSON.parse(fs.readFileSync(CACHE_PATH, 'utf8')) }
  catch (e) {
    cache = {}
  }
  return cache
}
