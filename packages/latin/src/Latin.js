import { GROUP_SCHEME_LOWER, GROUP_SCHEME_UPPER, Scope } from '../asset'
import { schemeToLex }                                   from './schemeToLex'

export class Latin {
  static #lexLower = schemeToLex(GROUP_SCHEME_LOWER)
  static #lexUpper = schemeToLex(GROUP_SCHEME_UPPER)

  static letter(glyph) { return Latin.#lexUpper[glyph] ?? Latin.#lexLower[glyph] ?? '-' }

  static filterFactory(scope) {
    if (scope === Scope.Upper) return Latin.isUpper
    if (scope === Scope.Lower) return Latin.isLower
    if (scope === Scope.Other) return Latin.isOther
    if (scope === Scope.Letter) return Latin.isLetter
    return () => true
  }

  static isLetter(glyph) { return glyph in Latin.#lexUpper || glyph in Latin.#lexLower }
  static isUpper(glyph) { return glyph in Latin.#lexUpper }
  static isLower(glyph) { return glyph in Latin.#lexLower }
  static isOther(glyph) { return !Latin.isLetter(glyph) }
}
