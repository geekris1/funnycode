import minimist from 'minimist';
import { loadConfig } from 'unconfig';
import { cwd as cwd$1 } from 'node:process';
import fs, { promises } from 'fs';
import path from 'path';
import CryptoJS from 'crypto-js';

const cwd = cwd$1();
const KEYFILE = ".funnycode";
const CONFIG = "funnycode.config";
const CACHE_PATH = winPath(path.join(cwd, "funnycode.cache.json"));
function winPath(url) {
  return url.replace(/\\/g, "/");
}
const errorMessage = {
  0: "Can not find a command, Please use funnycode encode/decode <path>",
  1: "Can not find entry config, Please use funnycode encode/decode <path> Or set in the funny.config entry",
  2: "Can not find key, Please use funnycode encode/decode <path> --key <key> Or add .funnycode file",
  3: "Please encode first , funnycode encode <path>"
};
function error(code) {
  console.error(errorMessage[code]);
  process.exit(1);
}
function getKey() {
  let key;
  try {
    key = fs.readFileSync(KEYFILE, "utf8");
  } catch (e) {
    key = void 0;
  }
  return key;
}
let cache;
function loadCache() {
  if (cache)
    return cache;
  try {
    cache = JSON.parse(fs.readFileSync(CACHE_PATH, "utf8"));
  } catch (e) {
    cache = {};
  }
  return cache;
}

async function decode(key) {
  const cache = loadCache();
  console.log(cache);
  if (!cache || Object.keys(cache).length === 0)
    error(3);
  const cacheArray = Object.entries(cache);
  for (const c of cacheArray) {
    const [file, code] = c;
    const decryptCode = crypto(code, key);
    await promises.writeFile(winPath(path.join(cwd, file)), decryptCode);
  }
  await save();
}
function crypto(code, key) {
  return CryptoJS.AES.decrypt(code, key).toString(CryptoJS.enc.Utf8);
}
async function save() {
  await promises.writeFile(CACHE_PATH, "{}");
  console.log("game over!");
}

async function funnycode() {
  const argv = minimist(process.argv.slice(2), { alias: { k: "key" } });
  const event = argv._[0];
  let entry = argv._[1];
  if (!event)
    error(0);
  if (!entry) {
    const { config } = await loadConfig({
      sources: {
        files: [CONFIG]
      }
    });
    if (!config.entry)
      error(1);
    entry = config.entry;
  }
  const key = argv.key || getKey();
  if (!key)
    error(2);
  if (event === "encode") ; else
    decode(key);
}
funnycode();

export { funnycode };
