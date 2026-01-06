import { config }     from 'dotenv'
import { test }       from 'node:test'
import { readFile }   from 'fs/promises'
import { $ }                from '@spare/xr'
import { deco, decoObject } from '@spare/logger'
import { VFM }              from '../src/VFM.js'

config({ path: '../../.env' })

const FONT_PATH = process.env.RES_FONT_PATH
const LAYER = 'Regular'

test('vfm test', async () => {
  console.log($.fontlab('vfm').path(FONT_PATH))

  const json = await JSON.parse(await readFile(FONT_PATH, 'utf8'))

  console.log($.fontlab('read').json(decoObject(json)))

  console.log($.fontlab('read').json(decoObject(json.masters)))

  const vfm = VFM.build(json)

  const LAYER='Regular'

  console.log($.fontlab('read').vfm(decoObject(vfm)))

  console.log($.fontlab('read').vfm(decoObject(vfm.selectMetrics(LAYER))))

  console.log($.fontlab('metricSeries').vfm(deco(vfm.metricSeries(LAYER))))
})