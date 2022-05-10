import { bracket }              from '@texting/bracket'
import { mapEntry }             from '@vect/object-mapper'
import { filter }               from '@vect/object-select'
import { GLYPH_TO_CHAR as RAW } from '../asset/encoding/win1252'

const GLYPH_TO_CHAR = filter(RAW, (g, c) => /^[^a-zA-Z]$/.test(c))
const CHAR_TO_GLYPH = mapEntry(GLYPH_TO_CHAR, (g, c) => [ c, g ])

// 'at' to '[@]'
export const glyphToLabel = name => name in GLYPH_TO_CHAR ? bracket(GLYPH_TO_CHAR[name]) : name

// '[@]' to 'at'
export const labelToGlyph = label => {
  let ms, ch
  return (ms = /^\[(.)\]$/.exec(label)) && ([ , ch ] = ms) && (ch in CHAR_TO_GLYPH)
    ? CHAR_TO_GLYPH[ch]
    : label
}


