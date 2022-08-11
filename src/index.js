import minimist from 'minimist'
import { loadConfig } from 'unconfig'
import { CONFIG, error, getKey } from './utils.js'
import encode from './encode.js'
import decode from './decode.js'

const argv = minimist(process.argv.slice(2), { alias: { k: 'key' } })
const event = argv._[0]
let entry = argv._[1]
if (!event)
  error(0)

if (!entry) {
  const { config } = await loadConfig({
    sources: {
      files: [CONFIG],
    },
  })
  if (!config.entry)
    error(1)

  entry = config.entry
}

const key = argv.key || getKey()
if (!key)
  error(2)

if (event === 'encode')
  encode(entry, key)
else
  decode(key)

