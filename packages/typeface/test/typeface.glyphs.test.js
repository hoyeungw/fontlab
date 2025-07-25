import { test }       from 'node:test'
import { TypefaceIO } from '@fontlab/scripts'
import { says }       from '@spare/xr'
import { decoObject } from '@spare/logger'

test('typeface glyphs test', async () => {
  const typeface = await TypefaceIO.loadTypeface('../../playground/origin/JetBrainsSans.vfm')
  says.glyphs(typeface.face)
  says.layers(typeface.layers)
  says.glyphs(typeface.glyphs())
  says.alphabetGrouped(decoObject(typeface.alphabetGrouped()))
})