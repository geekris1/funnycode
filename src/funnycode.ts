import minimist from 'minimist'
import { loadConfig } from 'unconfig'
import { CONFIG, error, getKey } from './utils.js'
import encode from './encode.js'
import decode from './decode.js'

export async function funnycode() {
  const argv = minimist(process.argv.slice(2), { alias: { k: 'key' } })
  const event = argv._[0]
  let entry: string = argv._[1]
  if (!event)
    error(0)

  if (!entry) {
    const { config } = await loadConfig({
      sources: {
        files: [CONFIG],
      },
    }) as { config: { entry: string } }
    if (!config.entry)
      error(1)

    entry = config.entry
  }

  const key = argv.key || getKey()
  if (!key)
    error(2)
  if (event === 'encode') {
    // 内存泄漏, 待排查
    // encode(entry, key)
  }
  else { decode(key) }
}

funnycode()
