import { makeEmbedded }                             from '@foba/util'
import { decoCrostab, says }                        from '@spare/logger'
import { strategies }                               from '@valjoux/strategies'
import { indexed }                                  from '@vect/nested'
import { mapToObject }                              from '@vect/object-init'
import { ALPHABET_UPPER, DIACRITICS, ORTHO_FRENCH } from '../../asset'
import { Latin }                                    from '../../src/Latin'

export const REGEX_UNITY_UPPER = /^@?([A-Z])(?![RUu])/ // exclude: CR NULL Euro
export const REGEX_UPPER = /^[A-Z]$/
export const REGEX_CLASS_UPPER = /^@[A-Z]/
export const EXCL_UPPER = ['NULL', 'CR', 'Euro']

const french = mapToObject([...indexed(ORTHO_FRENCH, (x, y, v) => v)], x => x)
const simple = {
  E: 'E',
  Eacute: 'Eacute',
  AE: 'AE',
  OE: 'OE',
  NJ: 'NJ',
  IJ: 'IJ',
  LJ: 'LJ',

  e: 'e',
  eacute: 'eacute',

  NULL: 'NULL',
  CR: 'CR',
  Euro: 'Euro',
  cent: 'cent'
}

const FRENCH = {
  ...mapToObject(ALPHABET_UPPER, x => x),
  ...mapToObject([...indexed(ORTHO_FRENCH, (x, y, v) => v)], x => x)
}

const { lapse, result } = strategies({
  repeat: 1E+6,
  candidates: simple  |> makeEmbedded,
  methods: {
    bench: x => !!x,
    official: Latin.isUpper,
    regs: x => REGEX_UPPER.test(x) || REGEX_CLASS_UPPER.test(x),
    unity: x => REGEX_UNITY_UPPER.test(x), // && !EXCL_UPPER.includes(x),
    french: glyph => !!FRENCH[glyph],
    stupid: glyph => ALPHABET_UPPER.includes(glyph[0]) && DIACRITICS.includes(glyph.slice(1)),
    old: glyph => {
      if (REGEX_UPPER.test(glyph)) return true // A, B, C
      if (REGEX_CLASS_UPPER.test(glyph)) return true // @A, @B, @C
      if (EXCL_UPPER.includes(glyph)) return false // not Euro, CR
      if (REGEX_UPPER.test(glyph[0])) return true // A, B, C initials (normally alphabets)
      // && Latin.#safeList.add(glyph.toLowerCase())
      return false // not others
    }
  }
})

lapse |> decoCrostab |> says['lapse']
'' |> console.log
result |> decoCrostab |> says['result']
'' |> console.log
