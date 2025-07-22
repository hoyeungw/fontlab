import { UNION } from '@analys/enum-join-modes'

export const
  GLYPH = 'glyph',
  LETTER = 'letter',
  LABEL = 'label',
  GROUP = 'group',
  LAYER = 'layer',
  KERNING = 'kerning',
  PREV = 'prev',
  CURR = 'curr',
  NEXT = 'next',
  FONTLAB = '>> fontlab',
  L = 'L',
  R = 'R'

export const JOIN_SPEC = { fields: [ GLYPH ], joinType: UNION, fillEmpty: '' }
export const CONVERT_OPTIONS = { groups: true, pairs: true, metrics: true }