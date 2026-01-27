import { config }     from 'dotenv'
import { readFile }   from 'fs/promises'
import { test }       from 'node:test'
import { decoObject } from '@spare/logger'
import { $ }          from '@spare/xr'
import { Master }     from '../src/Master.js'

config({ path: '../../.env' })

const FONT_PATH = process.env.FONT_PATH
const LAYER = 'Regular'

function decoMaster(master) {
  return ({
    name: master.name,
    kerningClasses: master.kerningClasses,
    pairs: master.kerningPairs,
  })
}
test('master test', async () => {
  console.log($.fontlab('vfm').path(FONT_PATH))
  const vfm = await JSON.parse(await readFile(FONT_PATH, 'utf8'))
  console.log($.fontlab('read').vfm(decoObject(vfm)))
  const master = Master.from(LAYER, vfm.masters[LAYER])
  console.log($.fontlab('read').master(master))
  console.log({
    name: master.name,
    kerningClasses: master.kerningClasses,
    pairs: master.pairs,
  })
})

test('master kerningPairs test', async () => {
  console.log($.fontlab('vfm').path(FONT_PATH))
  const vfm = await JSON.parse(await readFile(FONT_PATH, 'utf8'))
  const master = Master.from(LAYER, vfm.masters[LAYER])
  const pairs = master.pairs
  const crostabCollection = pairs.crostabCollection()
  const crostab = pairs.crostab(null, '')
  // console.log(decoCrostab(crostab)) // { direct: POINTWISE, pres: { str: OCEAN, pos: FRESH, neg: MOSS },},

  // console.log($.fontlab('read').grouped(deco(vfm.masters[LAYER].kerningClasses)))
  // const kerningClasses = KerningClasses.build(vfm.masters[LAYER].kerningClasses)
  // const grouped = kerningClasses.toMultimap()
  // console.log($.fontlab('read').grouped(deco(grouped)))
})

