import minimist from 'minimist';
import { loadConfig } from 'unconfig'
import { error, getKey, CONFIG } from './utils.js'
import encode from './encode.js';
import decode from './decode.js'

const argv = minimist(process.argv.slice(2), { alias: { k: 'key' } });
let [event, entry] = argv._;
if (!event) {
    error(0)
}
if (!entry) {
    const { config } = await loadConfig({
        sources: {
            files: [CONFIG]
        }
    })
    if (!config.entry) {
        error(1)
    }
    entry = config.entry
}

let key = argv.key;
if (!key) {
    key = getKey()
    if (!key) {
        error(2)
    }
}

if (event === 'encode') {
    encode(entry, key)
} else {
    decode(key)
}



