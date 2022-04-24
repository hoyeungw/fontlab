import { init }                                         from '@vect/matrix-init'
import { merge }                                        from '@vect/vector-merge'
import { ALPHABETS_LOWER, ALPHABETS_UPPER, DIACRITICS } from '../asset'
import { Category }                                     from '../asset/Category'
import { EXCLUSION_UPPER }                              from '../asset/GLYPH_NAMES'

const REGEX_UPPER = /^[A-Z]$/
const REGEX_LOWER = /^[a-z]$/
const REGEX_ALPHA = /^[A-Za-z]$/

export class GL {
  static #alphabets = merge(ALPHABETS_UPPER, ALPHABETS_LOWER)
  static #safeList = new Set()
  static #diacritics = init(GL.#alphabets.length, DIACRITICS.length, (i, j) => GL.#alphabets[i] + DIACRITICS[j]).flat()
  static filter(list, category) {
    if (category === Category.Upper) return list.filter(GL.isUpper)
    if (category === Category.Lower) return list.filter(GL.isLower)
    if (category === Category.Other) return list.filter(GL.isOther)
    return list
  }
  static isDiacritic(name) { return GL.#diacritics.includes(name.toLowerCase()) }
  static glyph(name) {
    if (REGEX_ALPHA.test(name)) return name // A, B, C
    if (name[0] === '@' && REGEX_ALPHA.test(name[1])) return name[1] // @A, @B, @C
    if (EXCLUSION_UPPER.includes(name)) return null // not Euro, CR
    if (REGEX_UPPER.test(name[0]) && GL.#safeList.add(name.toLowerCase())) return name[0]
    if (GL.#safeList.has(name.toLowerCase())) return name[0] // pre-stored in #safeList, because a,b,c initials often not alphabets
    if (GL.isDiacritic(name)) return name[0] // extra determine if diacritic
    return null // not others
  }
  static isUpper(name) {
    if (REGEX_UPPER.test(name)) return true // A, B, C
    if (name[0] === '@' && REGEX_UPPER.test(name[1])) return true // @A, @B, @C
    if (EXCLUSION_UPPER.includes(name)) return false // not Euro, CR
    if (REGEX_UPPER.test(name[0]) && GL.#safeList.add(name.toLowerCase())) return true // A, B, C initials (normally alphabets)
    return false // not others
  }
  static isLower(name) {
    if (REGEX_LOWER.test(name)) return true // a, b, c
    if (name[0] === '@' && REGEX_LOWER.test(name[1])) return true // @a, @b, @c
    if (GL.#safeList.has(name)) return true // pre-stored in #safeList, because a,b,c initials often not alphabets
    if (GL.isDiacritic(name)) return true // extra determine if diacritic
    return false // not others
  }
  static isOther(name) {
    if (GL.isUpper(name)) return false
    if (GL.isLower(name)) return false
    return true
  }
}
