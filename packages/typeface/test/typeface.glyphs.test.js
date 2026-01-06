import { config }     from 'dotenv' // Add this at the top
import { test }  from 'node:test'
import { VFMIO } from '@fontlab/scripts'
import { says }  from '@spare/xr'
import { decoObject } from '@spare/logger'

config({ path: '../../.env' })
const FONT_PATH = process.env.FONT_PATH

test('typeface glyphs test', async () => {
  const typeface = await VFMIO.readFile(FONT_PATH)
  says.face(typeface.face)
  says.layers(typeface.layers)
  says.glyphs(typeface.glyphs())
  says.alphabetGroups(decoObject(typeface.alphabetGroups()))
})