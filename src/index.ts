import minimist from 'minimist'
import { loadConfig } from 'unconfig'
import { CONFIG, error, getKey } from './utils'
import encode from './encode'
import decode from './decode'
import type { Config } from './types'

async function start() {
  const argv = minimist(process.argv.slice(2), { alias: { k: 'key' } })
  const event = argv._[0]
  let entry = argv._[1] as string | string[]
  if (!event)
    error(0)

  if (!entry) {
    const { config } = await loadConfig<Config>({
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
}

start()
