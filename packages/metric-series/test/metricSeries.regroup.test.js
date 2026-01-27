import { config }                 from 'dotenv'
import { test }                   from 'node:test'
import { readFile }               from 'fs/promises'
import { $ }                      from '@spare/xr'
import { decoObject, decoVector } from '@spare/logger'
import { VFM }                    from '../../vfm/index.js'
import { KerningClasses }         from '@fontlab/kerning-class'
import { decoCrostabLocal }       from '@fontlab/kerning-pairs'

config({ path: '../../.env' })

const FONT_PATH = process.env.FONT_PATH
const GROUP_PATH = process.env.GROUP_PATH
// const FONT_PATH = 'C:/Users/leagy/gyrogit/js/fontlab/playground/origin/DolceFut.vfm'
// const GROUP_PATH = 'file://C:/Users/leagy/gyrogit/js/fontlab/playground/config/DolceFut-grouping.js'
const LAYER = 'Regular'

test('metricSeries regroup test', async () => {
  console.log($.fontlab('vfm').path(FONT_PATH))

  const json = await JSON.parse(await readFile(FONT_PATH, 'utf8'))

  console.log($.fontlab('read').json(decoObject(json)))

  const vfm = VFM.build(json)

  console.log($.fontlab('read').vfm(decoObject(vfm)))

  const metricSeries1 = vfm.metricSeries(LAYER)

  console.log($.fontlab('read').metricSeries(decoVector(metricSeries1.metricGlyphs())))
  // console.log($.fontlab('read').metricSeries(deco(metricSeries)))

  for (const group of metricSeries1.kerningClasses) {
    console.log($.fontlab('series')['1'](group.name)[group.length](`${group}`))
  }
  console.log()

  const { default: presetGroups } = await import('file://' + GROUP_PATH)

  const externGroups = KerningClasses.from(presetGroups)

  const metricSeries2 = metricSeries1.refactorGroups(externGroups)

  // console.log($.fontlab('read').metricSeries(deco(metricSeries2)))

  const crostab = metricSeries2.kerningPairs.crostab(null, '')

  // $.fontlab('read').group
  for (const group of metricSeries2.kerningClasses) {
    console.log($.fontlab('series')['2'](group.name)[group.length](`${group}`))
  }
  console.log()

  console.log($.fontlab('read').vfm(decoCrostabLocal(crostab)))
})