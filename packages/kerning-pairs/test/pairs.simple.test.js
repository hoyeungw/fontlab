import { config }           from 'dotenv'
import { readFile }         from 'fs/promises'
import { test }             from 'node:test'
import { $ }                from '@spare/xr'
import { KerningPairs }     from '../src/KerningPairs.js'
import { decoCrostabLocal } from '../src/utils/decoCrostabLocal.js'

config({ path: '../../.env' })

const FONT_PATH = process.env.RES_FONT_PATH
const LAYER = 'Regular'

test('master kerningPairs test', async () => {
  console.log($.fontlab('VFM').path(FONT_PATH))

  const vfm = await JSON.parse(await readFile(FONT_PATH, 'utf8'))

  const pairs = KerningPairs.from(vfm.masters[LAYER]?.pairs)

  for (const crostab of pairs.intoCrostabs()) { console.log(decoCrostabLocal(crostab)) }

  const fake = pairs.crostab(null, '')

  console.log($.fontlab('pairs').size(`${fake.height} x ${fake.width}`))  // .crostab(decoCrostabLocal(crostab)))
})

