import { Table }                           from '@analys/table'
import { decoTable }                       from '@spare/logger'
import { says }                            from '@spare/xr'
import { indexed }                         from '@vect/object-mapper'
import { GLYPH_TO_CHAR }                   from '../asset/encoding/win1252'
import { asc, glyphToLabel, labelToGlyph } from '../util'

const REG_NUMS = /^(?:zero|one|two|three|four|five|six|seven|eight|nine|ten)$/
const REG_PUNC = /^(?:period|comma|quot|guil|brac|paren|hyph|under|exclam|quest|tilde)|(?:bar|slash|dash|colon)$/
const REG_CURR = /^(?:currency|dollar|Euro|sterling|yen|cent)$/

const GLYPH = 'glyph', LABEL = 'label', GLYPH2 = 'glyph2'
const HEAD = [ GLYPH, LABEL, GLYPH2 ]
const toRow = x => [ x, x = glyphToLabel(x), labelToGlyph(x) ]

const tableCollection = {
  nums: Table.from({ head: HEAD, rows: [ ...indexed(GLYPH_TO_CHAR, g => REG_NUMS.test(g), toRow) ] }).sort(LABEL, asc),
  punc: Table.from({ head: HEAD, rows: [ ...indexed(GLYPH_TO_CHAR, g => REG_PUNC.test(g), toRow) ] }),
  curr: Table.from({ head: HEAD, rows: [ ...indexed(GLYPH_TO_CHAR, g => REG_CURR.test(g), toRow) ] }),
}
for (let [ name, table ] of indexed(tableCollection)) {
  table |> decoTable |> says[name]
}