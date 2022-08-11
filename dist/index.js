'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var minimist = require('minimist');
var unconfig = require('unconfig');
var node_process = require('node:process');
var fs = require('fs');
var path = require('path');
var CryptoJS = require('crypto-js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var minimist__default = /*#__PURE__*/_interopDefaultLegacy(minimist);
var fs__default = /*#__PURE__*/_interopDefaultLegacy(fs);
var path__default = /*#__PURE__*/_interopDefaultLegacy(path);
var CryptoJS__default = /*#__PURE__*/_interopDefaultLegacy(CryptoJS);

const cwd = node_process.cwd();
const KEYFILE = ".funnycode";
const CONFIG = "funnycode.config";
const CACHE_PATH = winPath(path__default["default"].join(cwd, "funnycode.cache.json"));
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
    key = fs__default["default"].readFileSync(KEYFILE, "utf8");
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
    cache = JSON.parse(fs__default["default"].readFileSync(CACHE_PATH, "utf8"));
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
    await fs.promises.writeFile(winPath(path__default["default"].join(cwd, file)), decryptCode);
  }
  await save();
}
function crypto(code, key) {
  return CryptoJS__default["default"].AES.decrypt(code, key).toString(CryptoJS__default["default"].enc.Utf8);
}
async function save() {
  await fs.promises.writeFile(CACHE_PATH, "{}");
  console.log("game over!");
}

async function funnycode() {
  const argv = minimist__default["default"](process.argv.slice(2), { alias: { k: "key" } });
  const event = argv._[0];
  let entry = argv._[1];
  if (!event)
    error(0);
  if (!entry) {
    const { config } = await unconfig.loadConfig({
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

exports.funnycode = funnycode;
