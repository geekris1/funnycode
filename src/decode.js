import { promises as fs } from 'fs'
import path from 'path'
import CryptoJS from 'crypto-js'
import { cwd, winPath, error, CACHE_PATH, loadCache } from './utils.js'
async function decode(key) {
    const cache = loadCache()
    console.log(cache)
    if (!cache || Object.keys(cache).length === 0) error(3)
    const cacheArray = Object.entries(cache);
    for (let c of cacheArray) {
        const [file, code] = c;
        let decryptCode = crypto(code, key)
        await fs.writeFile(winPath(path.join(cwd, file)), decryptCode)
    }
    await save()
}

function crypto(code, key) {
    return CryptoJS.AES.decrypt(code, key).toString(CryptoJS.enc.Utf8);
}
async function save() {
    await fs.writeFile(CACHE_PATH, "{}")
    console.log('game over!')

}

function hanldeTypescript() {

}
export default decode