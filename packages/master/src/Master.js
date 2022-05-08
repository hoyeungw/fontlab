import { groupedToSurject, nestedToCrostab }                 from '@analys/convert'
import { MIN }                                               from '@analys/enum-pivot-mode'
import { Side }                                              from '@fontlab/enum-side'
import { Grouped }                                           from '@fontlab/kerning-class'
import { Latin }                                             from '@fontlab/latin'
import { parseNum }                                          from '@typen/numeral'
import { head as yKeys, indexed, side as xKeys, updateCell } from '@vect/nested'
import { CONVERT_OPTIONS }                                   from '../asset'
import { AT, getGlyph, glyphTrim, offAT, unionAcquire }      from '../utils'
import { masterToJson }                                      from './masterToJson'

export class Master {
  /** @type {string}                                      */ name
  /** @type {Object<string,Group>}                        */ grouped
  /** @type {Object<string,Object<string,string|number>>} */ pairs

  constructor(name, grouped, pairs) {
    this.name = name
    this.grouped = grouped
    this.pairs = pairs
  }
  static build(name, grouped, body) { return new Master(name, grouped, body) }
  static keyVFM(name, vfm) { return new Master(name, Grouped.from(vfm.kerningClasses ?? []), vfm.pairs ?? {}) }

  get kerningClasses() { return Object.values(this.grouped) }

  glyphsFromPairs(side) {
    const list = []
    if (side & 1) unionAcquire(list, xKeys(this.pairs))
    if (side & 2) unionAcquire(list, yKeys(this.pairs))
    return list
  }
  glyphs(side) {
    let glyphs = Object.keys(groupedToSurject(Grouped.select(this.grouped, side)))
    if (side & 1) unionAcquire(glyphs, xKeys(this.pairs).map(glyphTrim))
    if (side & 2) unionAcquire(glyphs, yKeys(this.pairs).map(glyphTrim))
    return glyphs
  }

  get flattenPairs() {
    const
      xG = Grouped.select(this.grouped, Side.Verso),
      yG = Grouped.select(this.grouped, Side.Recto),
      nested = {}, fake = [], update = updateCell.bind(nested)
    for (let [ xn, yn, kern ] of indexed(this.pairs)) {
      if (AT.test(xn) && (xn = offAT(xn))) {
        if (AT.test(yn) && (yn = offAT(yn)))
          for (let x of (xG[xn] ?? fake)) for (let y of (yG[yn] ?? fake)) update(x, y, kern)
        else
          for (let x of (xG[xn] ?? fake)) update(x, yn, kern)
      }
      else {
        if (AT.test(yn) && (yn = offAT(yn)))
          for (let y of (yG[yn] ?? fake)) update(xn, y, kern)
        else
          update(xn, yn, kern)
      }
    }
    return nested
  }

  groupCrostab(mode = MIN, scopeX, scopeY, po) {
    const xf = Latin.factory(scopeX), yf = Latin.factory(scopeY)
    return nestedToCrostab(
      this.pairs, mode,
      (x, y) => xf(getGlyph(x)) && yf(getGlyph(y)),
      (x, y, kern) => [ x, y, parseNum(kern) ],
      po,
    )
  }
  letterCrostab(mode = MIN, scopeX, scopeY, po) {
    const xf = Latin.factory(scopeX), yf = Latin.factory(scopeY)
    return nestedToCrostab(
      this.flattenPairs, mode,
      (x, y) => xf(x) && yf(y),
      (x, y, kern) => [ x, y, parseNum(kern) ],
      po,
    )
  }

  toJson(options = CONVERT_OPTIONS) { return masterToJson.call(options, this) }
}
