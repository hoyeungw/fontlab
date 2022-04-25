import { makeEmbedded }                             from '@foba/util'
import { decoCrostab, says }                        from '@spare/logger'
import { strategies }                               from '@valjoux/strategies'
import { indexed }                                  from '@vect/nested'
import { mapToObject }                              from '@vect/object-init'
import { ALPHABET_LOWER, DIACRITICS, ORTHO_FRENCH } from '../../asset'
import { Latin }                                    from '../../src/Latin'

export const REGEX_UNITY_LOWER = /^@?([a-z])/
export const REGEX_LOWER = /^[a-z]$/
export const REGEX_CLASS_LOWER = /^@[a-z]/

export const INCL_LOWER = ['germandbls', 'cent', 'dotlessi'] // 'ae', 'oe', 'lj', 'ij', 'nj', 'thorn'

const UPPERS = {
  E: 'E',
  Eacute: 'Eacute',
  AE: 'AE',
  OE: 'OE',
  NJ: 'NJ',
  IJ: 'IJ',
  LJ: 'LJ',
}
const LOWERS = {
  e: 'e',
  eacute: 'eacute',
  ae: 'ae',
  oe: 'oe',
  nj: 'nj',
  ij: 'ij',
  lj: 'lj',

  cent: 'cent'
}
const NON_LETTERS = {
  NULL: 'NULL',
  CR: 'CR',
  Euro: 'Euro',
  space: 'space',
  bar: 'bar',
  degree: 'degree',
  minute: 'minute',
  second: 'second',
  plus: 'plus',
  minus: 'minus',
  zero: 'zero',
  one: 'one',
  po: 'po',
  period: 'period',
  comma: 'comma',
  colon: 'colon',
  ellipsis: 'ellipsis',
  exclam: 'exclam',
  slash: 'slash',
}

const FRENCH = {
  ...mapToObject(ALPHABET_LOWER, x => x),
  ...mapToObject([...indexed(ORTHO_FRENCH, (x, y, v) => v)], x => x)
}

const METHODS = {
  bench: x => !!x,
  official: Latin.isLower,
  regs: x => REGEX_LOWER.test(x) || REGEX_CLASS_LOWER.test(x),
  unity: x => REGEX_UNITY_LOWER.test(x), // && !EXCL_LOWER.includes(x),
  french: glyph => !!FRENCH[glyph],
  stupid: glyph => ALPHABET_LOWER.includes(glyph[0]) && DIACRITICS.includes(glyph.slice(1)),
  old: glyph => {
    if (REGEX_LOWER.test(glyph)) return true //
    if (REGEX_CLASS_LOWER.test(glyph)) return true //
    if (INCL_LOWER.includes(glyph)) return true //
    if (REGEX_LOWER.test(glyph[0])) return true //
    // && Latin.#safeList.add(glyph.toLowerCase())
    return false // not others
  }
}

{
  const { lapse, result } = strategies({
    repeat: 6E+5,
    candidates: UPPERS|> makeEmbedded,
    methods: METHODS
  })
  lapse |> decoCrostab |> says['lapse']
  '' |> console.log
  result |> decoCrostab |> says['result']
  '' |> console.log
}

{
  const { lapse, result } = strategies({
    repeat: 6E+5,
    candidates: LOWERS|> makeEmbedded,
    methods: METHODS
  })
  lapse |> decoCrostab |> says['lapse']
  '' |> console.log
  result |> decoCrostab |> says['result']
  '' |> console.log
}

{
  const { lapse, result } = strategies({
    repeat: 6E+5,
    candidates: NON_LETTERS|> makeEmbedded,
    methods: METHODS
  })
  lapse |> decoCrostab |> says['lapse']
  '' |> console.log
  result |> decoCrostab |> says['result']
  '' |> console.log
}
