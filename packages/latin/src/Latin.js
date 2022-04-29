import { groupedToSurject }                              from '@analys/convert'
import { GROUP_SCHEME_LOWER, GROUP_SCHEME_UPPER, Scope } from '../asset'

export class Latin {
  static #lexLower = groupedToSurject(GROUP_SCHEME_LOWER)
  static #lexUpper = groupedToSurject(GROUP_SCHEME_UPPER)

  static letter(glyph) { return Latin.#lexUpper[glyph] ?? Latin.#lexLower[glyph] ?? null }

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
