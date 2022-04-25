import { Scope }              from '../../metrics/asset/Scope'
import { GROUP_SCHEME_LOWER } from '../asset/GROUP_SCHEME_LOWER'
import { GROUP_SCHEME_UPPER } from '../asset/GROUP_SCHEME_UPPER'
import { schemeToLex }        from './schemeToLex'

export class Latin {
  static #lexLower = schemeToLex(GROUP_SCHEME_LOWER)
  static #lexUpper = schemeToLex(GROUP_SCHEME_UPPER)
  static filter(list, category) {
    if (category === Scope.Upper) return list.filter(Latin.isUpper)
    if (category === Scope.Lower) return list.filter(Latin.isLower)
    if (category === Scope.Other) return list.filter(Latin.isOther)
    return list
  }
  static glyph(glyph) { return Latin.#lexUpper(glyph) ?? Latin.#lexLower(glyph) ?? '-' }
  static make(scope) {
    if (scope === Scope.Upper) return Latin.isUpper
    if (scope === Scope.Lower) return Latin.isLower
    if (scope === Scope.Other) return Latin.isOther
    return () => true
  }

  static isLetter(glyph) { return glyph in Latin.#lexUpper || glyph in Latin.#lexLower }
  static isUpper(glyph) { return glyph in Latin.#lexUpper }
  static isLower(glyph) { return glyph in Latin.#lexLower }
  static isOther(glyph) { return !Latin.isLetter(glyph) }

}
