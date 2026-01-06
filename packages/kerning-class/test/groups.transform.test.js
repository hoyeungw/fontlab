import { config }          from 'dotenv'
import { decoObject }      from '@spare/logger'
import { deco }            from '@spare/deco'
import { $ }               from '@spare/xr'
import { BESQUE }          from '@palett/presets'
import { readFile }        from 'fs/promises'
import { test }           from 'node:test'
import { KerningClasses } from '../src/KerningClasses.js'
import { len }            from '@vect/object-index'
import { Side }            from '@fontlab/enum-side'

config({ path: '../../.env' })

const FONT_PATH = process.env.RES_FONT
const LAYER = 'Regular'

test('kerningClasses simple test', async () => {
  console.log($.fontlab('vfm').path(FONT_PATH))

  const vfm = await JSON.parse(await readFile(FONT_PATH, 'utf8'))

  console.log($.fontlab('read').vfm(decoObject(vfm)))

  const groups = KerningClasses.build(vfm.masters[LAYER].kerningClasses)

  console.log($.fontlab('group-collection').iterable(deco.call({ thres: 256 }, groups)))

  const groupedLeft = groups.toGrouped(Side.Left)
  const groupedRight = groups.toGrouped(Side.Right)

  console.log($.fontlab('group-collection').grouped('-').left(deco.call({ pres: BESQUE }, groupedLeft)))
  console.log($.fontlab('group-collection').grouped('-').right(deco.call({ pres: BESQUE }, groupedRight)))

  const surjectL = groups.toSurject(Side.Left), surjectR = groups.toSurject(Side.Right)
  console.log($.fontlab('group-collection').surject('-').left(len(surjectL)).right(len(surjectR)))
  // console.log($.fontlab('group-collection').surject(deco.call({}, surjectL)))
})