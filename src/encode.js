import fg from 'fast-glob'
import { promises as fs } from 'fs'
import path from 'path'
import CryptoJS from 'crypto-js'
import JavaScriptObfuscator from 'javascript-obfuscator';
import ts from 'typescript'

import { cwd, isDir, winPath, error, getKey, isUnixBashShellPath, CACHE_PATH, loadCache } from './utils.js'
let cache = loadCache()
async function encode(entry, key) {
    let files;
    if (isUnixBashShellPath(entry) || !isDir(winPath(path.join(cwd, entry)))) {
        files = await fg(entry)
    } else {
        files = await fg(entry + '/**/*.{js,ts,cjs,mjs}',)
    }
    for (let file of files) {
        await transform(file, key)
    }
    await save()
}
// TODO : handle ts(extname) file
async function transform(file, key) {
    const absolutePath = winPath(path.join(cwd, file))
    let code = await fs.readFile(absolutePath, 'utf8');
    if (/funnycode/.test(code)) {
        console.error(`${file} already encoded , Please decode first.`)
    } else {
        cache[file] = crypto(code, key);
        let isTs = path.extname(file) === '.ts';
        if (isTs) {
            code = await toJavascript(code)
        }
        let funnycode = obfuscator(code);
        funnycode = `// @ts-nocheck
${funnycode}
/** funnycode symbol*/`
        await fs.writeFile(absolutePath, funnycode)
    }

}

function crypto(code, key) {
    // Encrypt
    return CryptoJS.AES.encrypt(code, key).toString();
}
function obfuscator(code) {
    let obfuscationResult = JavaScriptObfuscator.obfuscate(code);
    return obfuscationResult.getObfuscatedCode()

}

async function toJavascript(code) {
    let { compilerOptions = {} } = JSON.parse(await fs.readFile(winPath(path.join(cwd, 'tsconfig.json')), 'utf8'));
    let { outputText } = ts.transpileModule(code, { compilerOptions: { module: compilerOptions.module } });
    return outputText
}

async function save() {
    await fs.writeFile(CACHE_PATH, JSON.stringify(cache, null, 2))
    console.log('game over!', 'encode save')

}
export default encode