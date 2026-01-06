import { config }                                 from 'dotenv'
import { readFile }                               from 'fs/promises'
import { test }                                   from 'node:test'
import { $ }                                      from '@spare/xr'
import { KerningPairs }                           from '../src/KerningPairs.js'
import { decoCrostabLocal }                       from '../src/utils/decoCrostabLocal.js'
import { KerningClasses }                         from '@fontlab/kerning-class'
import { GROUP_SCHEME_LOWER, GROUP_SCHEME_UPPER } from '@fontlab/latin'
import { decoXY }                                 from '../src/utils/decoXY.js'

config({ path: '../../.env' })

const FONT_PATH = process.env.RES_FONT
const KERNING_CLASSES_PATH = process.env.KERNING_CLASSES_PATH
const LAYER = 'Regular'

test('pairs regroup gest', async () => {
  console.log($.fontlab('VFM').path(FONT_PATH))
  const vfm = await JSON.parse(await readFile(FONT_PATH, 'utf8'))

  const pairs = KerningPairs.from(vfm.masters[LAYER].pairs)
  for (const crostab of pairs.intoCrostabs()) { console.log(decoCrostabLocal(crostab)) }

  console.log('')
  const { default: rawKerningClasses } = await import('file:///' + KERNING_CLASSES_PATH)
  const kerningClasses = KerningClasses
    .from(rawKerningClasses)
    .expand(GROUP_SCHEME_UPPER)
    .expand(GROUP_SCHEME_LOWER)

  const pairs2 = pairs.regroup(kerningClasses)
  for (const crostab of pairs2.intoCrostabs()) { console.log(decoCrostabLocal(crostab)) }

  console.log($.fontlab('kerning pairs').size1(decoXY(pairs.size())).size2(decoXY(pairs2.size())))
})

